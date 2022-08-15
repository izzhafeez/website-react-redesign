import './Merits.css';

import contentData from '../data/content.json';
import awardsData from '../data/awards.json';
import certificatesData from '../data/certificates.json';
import experiencesData from '../data/experiences.json';
import languagesData from '../data/languages.json';
import skillsData from '../data/skills.json';
import toolsData from '../data/tools.json';

import Text from '../components/Text.js';
import Merit from '../components/Merit.js';
import Experience from '../components/Experience.js';

import desmosito from '../assets/desmosito.png';

function Merits() {
  const experiencesPreview = Object.keys(experiencesData.experiences).map((key, experience) => {
    return (
      <Experience
        experience={experiencesData.experiences[key]}
      ></Experience>
    );
  });
  const certificatesPreview = Object.keys(certificatesData.certificates).map((key, certificate) => {
    const merit = certificatesData.certificates[key];
    merit["key"] = key;
    merit["kind"] = "certificates";
    return (
      <Merit
        merit={merit}
      ></Merit>
    );
  });
  const awardsPreview = Object.keys(awardsData.awards).slice(0, 5).map((key, award) => {
    const merit = awardsData.awards[key];
    merit["key"] = key;
    merit["kind"] = "awards";
    return (
      <Merit
        merit={merit}
      ></Merit>
    );
  });
  const languagesPreview = Object.keys(languagesData.languages).slice(0, 10).map((key, language) => {
    const merit = languagesData.languages[key];
    merit["key"] = key;
    merit["kind"] = "languages";
    return (
      <Merit
        merit={merit}
      ></Merit>
    );
  });
  const toolsPreview = Object.keys(toolsData.tools).slice(0, 10).map((key, tool) => {
    const merit = toolsData.tools[key];
    merit["key"] = key;
    merit["kind"] = "tools";
    return (
      <Merit
        merit={merit}
      ></Merit>
    );
  });
  const skillsPreview = Object.keys(skillsData.skills).slice(0, 10).map((key, skill) => {
    const merit = skillsData.skills[key];
    merit["key"] = key;
    merit["kind"] = "skills";
    return (
      <Merit
        merit={merit}
      ></Merit>
    );
  });
  return (
    <div className="page">
      <img src={desmosito} alt="Logo" className="icon"></img>
      <Text
        title={contentData.merits.title}
        content={contentData.merits.content}
      ></Text>
      <h2 id="experience">EXPERIENCE</h2>
      <div className="experience-entries">{experiencesPreview}</div>
      <br></br>
      <h2 id="certificates">CERTIFICATES</h2>
      <div className="merits-entries">{certificatesPreview}</div>
      <br></br>
      <h2 id="awards">AWARDS</h2>
      <div className="merits-entries">{awardsPreview}</div>
      <br></br>
      <h2 id="languages">LANGUAGES</h2>
      <div className="merits-entries">{languagesPreview}</div>
      <br></br>
      <h2 id="tools">TOOLS</h2>
      <div className="merits-entries">{toolsPreview}</div>
      <br></br>
      <h2 id="skills">SKILLS</h2>
      <div className="merits-entries">{skillsPreview}</div>
    </div>
  );
}

export default Merits;