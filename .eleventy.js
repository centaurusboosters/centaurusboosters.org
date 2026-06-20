/**
 * Eleventy builds the static booster site from structured content files.
 * Static assets and the Decap admin app stay in public-facing paths so the
 * generated site preserves the current URL shape.
 */
module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "public/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "public/admin": "admin" });

  return {
    dir: {
      input: "src",
      output: "dist"
    },
    templateFormats: ["njk", "html"],
    htmlTemplateEngine: "njk"
  };
};
