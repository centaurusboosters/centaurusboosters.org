// Google Apps Script — Form-to-GitHub-Issue bridge
// Runtime: V8
// Trigger: onFormSubmit (installable, From form, On form submit)

var GITHUB_REPO     = "kurtharriger/2026-boosters";
var GITHUB_API_BASE = "https://api.github.com";

// Question indices in the form (0-based, by position)
var IDX_CHANGE_TYPE      = 0;
var IDX_PAGE             = 1;
var IDX_REQUESTED_CHANGE = 2;
var IDX_ASSETS           = 3;

function onFormSubmit(e) {
  var response       = e.response;
  var submitterEmail = response.getRespondentEmail() || "";
  var timestamp      = response.getTimestamp();

  // Form trigger: use getItemResponses(), not e.values (which is undefined here)
  var items = response.getItemResponses();
  var changeType      = items[IDX_CHANGE_TYPE]      ? items[IDX_CHANGE_TYPE].getResponse()      : "";
  var page            = items[IDX_PAGE]             ? items[IDX_PAGE].getResponse()             : "";
  var requestedChange = items[IDX_REQUESTED_CHANGE] ? items[IDX_REQUESTED_CHANGE].getResponse() : "";
  var assets          = items[IDX_ASSETS]           ? items[IDX_ASSETS].getResponse()           : "";

  Logger.log("Submission from: " + submitterEmail);
  Logger.log("Change type: " + changeType + " | Page: " + page);

  var title  = "[Website Change] " + changeType + " — " + page;
  var body   = buildIssueBody({
    changeType      : changeType,
    page            : page,
    requestedChange : requestedChange,
    assets          : assets,
    submitterEmail  : submitterEmail,
    timestamp       : timestamp
  });
  var labels = ["source:google-form", "agent:eligible", typeLabel(changeType)];

  var token = PropertiesService.getScriptProperties().getProperty("GITHUB_TOKEN");
  if (!token) {
    Logger.log("ERROR: GITHUB_TOKEN script property is not set");
    return;
  }

  var url     = GITHUB_API_BASE + "/repos/" + GITHUB_REPO + "/issues";
  var payload = JSON.stringify({ title: title, body: body, labels: labels });

  var options = {
    method            : "post",
    contentType       : "application/json",
    headers           : {
      "Authorization"        : "Bearer " + token,
      "Accept"               : "application/vnd.github+json",
      "X-GitHub-Api-Version" : "2022-11-28"
    },
    payload           : payload,
    muteHttpExceptions: true
  };

  var httpResponse;
  try {
    httpResponse = UrlFetchApp.fetch(url, options);
  } catch (err) {
    Logger.log("ERROR calling GitHub API: " + (err.message || String(err)));
    return;
  }

  var code = httpResponse.getResponseCode();
  var responseText = httpResponse.getContentText();

  if (code !== 201) {
    Logger.log("GitHub API returned " + code + ": " + responseText);
    return;
  }

  var issue = JSON.parse(responseText);
  Logger.log("Created issue #" + issue.number + ": " + issue.html_url);
}

function buildIssueBody(f) {
  var lines = [
    "## Requested change",
    "",
    f.requestedChange,
    "",
    "## Location",
    "",
    "- Page/section: " + f.page,
    ""
  ];

  if (f.assets) {
    lines.push("## Assets", "", f.assets, "");
  }

  lines.push(
    "## Request metadata",
    "",
    "- Request type: "  + f.changeType,
    "- Submitted by: "  + f.submitterEmail,
    "- Submitted at: "  + f.timestamp,
    "",
    "## Agent constraints",
    "",
    "- Preserve the current visual design unless the request requires a design change.",
    "- Change only what is necessary.",
    "- Do not merge the resulting pull request."
  );

  return lines.join("\n");
}

function typeLabel(changeType) {
  var map = {
    "Text"       : "type:content",
    "Correction" : "type:correction",
    "Event"      : "type:event",
    "Link"       : "type:link",
    "Sponsor"    : "type:sponsor",
    "Image"      : "type:image",
    "Other"      : "type:content"
  };
  var key = Object.keys(map).filter(function(k) {
    return k.toLowerCase() === changeType.trim().toLowerCase();
  })[0];
  return key ? map[key] : "type:content";
}
