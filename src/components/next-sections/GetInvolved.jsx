import getInvolved from '../../data/get-involved.json';
import forms from '../../data/forms.json';
import GetInvolvedSection from '../ui/GetInvolvedSection';

export default function GetInvolved() {
  return <GetInvolvedSection items={getInvolved.items} formUrls={forms} />;
}
