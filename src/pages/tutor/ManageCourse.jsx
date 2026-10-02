import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DashboardShell, {
  Notice,
  StatusBadge,
} from "../../components/common/DashboardShell";
import * as tutor from "../../services/tutorService";
import { uploadFile } from "../../services/resourceService";
const lessonBlank = {
  title: "",
  content: "",
  videoUrl: "",
  resourceUrl: "",
  resourceTitle: "",
  file: null,
};
const testBlank = {
  title: "",
  instructions: "",
  type: "QUIZ",
  startsAt: "",
  dueAt: "",
  durationMinutes: 30,
  maxScore: 100,
  published: true,
  questions: "",
};
export default function ManageCourse() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [moduleTitle, setModuleTitle] = useState("");
  const [forms, setForms] = useState({});
  const [tests, setTests] = useState({});
  const [submissions, setSubmissions] = useState({});
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  async function load() {
    const r = await tutor.courses();
    setCourse(r.data.courses.find((c) => c.id === Number(courseId)) || false);
  }
  useEffect(() => {
    load();
  }, [courseId]);
  async function addModule(e) {
    e.preventDefault();
    await tutor.addModule(courseId, moduleTitle);
    setModuleTitle("");
    setNotice("Module added.");
    load();
  }
  async function addLesson(e, moduleId) {
    e.preventDefault();
    setBusy(true);
    try {
      const f = forms[moduleId] || lessonBlank;
      let resourceUrl = f.resourceUrl;
      if (f.file) {
        const upload = await uploadFile(f.file);
        resourceUrl = upload.data.file.url;
      }
      await tutor.addLesson(courseId, moduleId, {
        ...f,
        resourceUrl,
        file: undefined,
      });
      setForms({ ...forms, [moduleId]: lessonBlank });
      setNotice("Learning section and material added.");
      await load();
    } catch (e) {
      setNotice(e.response?.data?.message || "The section could not be saved.");
    } finally {
      setBusy(false);
    }
  }
  async function addTest(e, moduleId) {
    e.preventDefault();
    const f = tests[moduleId] || testBlank;
    const questions = f.questions
      .split("\n")
      .map((x) => x.trim())
      .filter(Boolean)
      .map((prompt) => ({ prompt, type: "TEXT" }));
    await tutor.addAssessment(courseId, moduleId, { ...f, questions });
    setTests({ ...tests, [moduleId]: testBlank });
    setNotice("Assessment scheduled.");
    load();
  }
  async function removeModule(id) {
    if (confirm("Delete this module and all its content?")) {
      await tutor.deleteModule(courseId, id);
      load();
    }
  }
  async function review(assessmentId) {
    const r = await tutor.assessmentSubmissions(courseId, assessmentId);
    setSubmissions((current) => ({ ...current, [assessmentId]: r.data.submissions }));
  }
  async function grade(item, maxScore) {
    const score = prompt(`Score out of ${maxScore}`, item.score || "");
    if (score === null) return;
    const feedback = prompt("Feedback for the student (optional)", item.feedback || "");
    await tutor.gradeSubmission(courseId, item.id, { score, feedback });
    setNotice("Grade published to the student.");
    review(item.assessmentId);
  }
  if (course === null)
    return (
      <DashboardShell title="Course studio">
        <div className="loading-screen">
          <span className="loader" />
          Opening course studio…
        </div>
      </DashboardShell>
    );
  if (!course)
    return (
      <DashboardShell title="Course studio">
        <Notice type="error">Course unavailable or not assigned to you.</Notice>
      </DashboardShell>
    );
  return (
    <DashboardShell title="Course studio">
      <div className="studio-banner">
        <div>
          <p className="eyebrow">Editing course</p>
          <h2>{course.title}</h2>
          <p>
            Build modules in order. Add as many titled sections, files and
            assessments as the course requires.
          </p>
        </div>
        <StatusBadge status={course.status} />
      </div>
      <Notice>{notice}</Notice>
      <section className="panel studio-new-module">
        <h2>Add next module</h2>
        <form className="inline-form" onSubmit={addModule}>
          <input
            placeholder={`Module ${course.modules.length + 1} heading`}
            required
            value={moduleTitle}
            onChange={(e) => setModuleTitle(e.target.value)}
          />
          <button>Add module</button>
        </form>
      </section>
      <div className="studio-modules">
        {course.modules.map((m) => {
          const f = forms[m.id] || lessonBlank;
          const t = tests[m.id] || testBlank;
          return (
            <section className="panel module-studio" key={m.id}>
              <header>
                <span>Module {m.position}</span>
                <h2>{m.title}</h2>
                <button
                  className="danger-button"
                  onClick={() => removeModule(m.id)}
                >
                  Delete module
                </button>
              </header>
              <div className="section-list">
                {m.lessons.map((l, i) => (
                  <article key={l.id}>
                    <b>{i + 1}</b>
                    <div>
                      <strong>{l.title}</strong>
                      <p>{l.content?.slice(0, 130) || "No text content"}</p>
                      {l.resourceUrl && (
                        <small>
                          Attached: {l.resourceTitle || "downloadable material"}
                        </small>
                      )}
                    </div>
                  </article>
                ))}
              </div>
              <details>
                <summary>＋ Add next content section</summary>
                <form onSubmit={(e) => addLesson(e, m.id)}>
                  <label>
                    Section heading
                    <input
                      required
                      value={f.title}
                      onChange={(e) =>
                        setForms({
                          ...forms,
                          [m.id]: { ...f, title: e.target.value },
                        })
                      }
                    />
                  </label>
                  <label>
                    Styled learning content
                    <textarea
                      rows="9"
                      value={f.content}
                      onChange={(e) =>
                        setForms({
                          ...forms,
                          [m.id]: { ...f, content: e.target.value },
                        })
                      }
                      placeholder="Write the complete explanation for this section…"
                    />
                  </label>
                  <label>
                    Video URL
                    <input
                      type="url"
                      value={f.videoUrl}
                      onChange={(e) =>
                        setForms({
                          ...forms,
                          [m.id]: { ...f, videoUrl: e.target.value },
                        })
                      }
                    />
                  </label>
                  <label>
                    Material title
                    <input
                      value={f.resourceTitle}
                      onChange={(e) =>
                        setForms({
                          ...forms,
                          [m.id]: { ...f, resourceTitle: e.target.value },
                        })
                      }
                      placeholder="Practical workbook"
                    />
                  </label>
                  <label>
                    Upload PDF, Word, PowerPoint or text file
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
                      onChange={(e) =>
                        setForms({
                          ...forms,
                          [m.id]: { ...f, file: e.target.files[0] },
                        })
                      }
                    />
                  </label>
                  <button disabled={busy}>
                    {busy ? "Uploading and saving…" : "Add section"}
                  </button>
                </form>
              </details>
              <details>
                <summary>＋ Schedule quiz, test or exam</summary>
                <form className="form-grid" onSubmit={(e) => addTest(e, m.id)}>
                  <label>
                    Assessment title
                    <input
                      required
                      value={t.title}
                      onChange={(e) =>
                        setTests({
                          ...tests,
                          [m.id]: { ...t, title: e.target.value },
                        })
                      }
                    />
                  </label>
                  <label>
                    Type
                    <select
                      value={t.type}
                      onChange={(e) =>
                        setTests({
                          ...tests,
                          [m.id]: { ...t, type: e.target.value },
                        })
                      }
                    >
                      <option>QUIZ</option>
                      <option>TEST</option>
                      <option>EXAM</option>
                    </select>
                  </label>
                  <label>
                    Opens
                    <input
                      type="datetime-local"
                      value={t.startsAt}
                      onChange={(e) =>
                        setTests({
                          ...tests,
                          [m.id]: { ...t, startsAt: e.target.value },
                        })
                      }
                    />
                  </label>
                  <label>
                    Closes
                    <input
                      type="datetime-local"
                      value={t.dueAt}
                      onChange={(e) =>
                        setTests({
                          ...tests,
                          [m.id]: { ...t, dueAt: e.target.value },
                        })
                      }
                    />
                  </label>
                  <label>
                    Duration (minutes)
                    <input
                      type="number"
                      min="1"
                      value={t.durationMinutes}
                      onChange={(e) =>
                        setTests({
                          ...tests,
                          [m.id]: { ...t, durationMinutes: e.target.value },
                        })
                      }
                    />
                  </label>
                  <label className="full">
                    Instructions
                    <textarea
                      value={t.instructions}
                      onChange={(e) =>
                        setTests({
                          ...tests,
                          [m.id]: { ...t, instructions: e.target.value },
                        })
                      }
                    />
                  </label>
                  <label className="full">
                    Questions — one per line
                    <textarea
                      required
                      rows="6"
                      value={t.questions}
                      onChange={(e) =>
                        setTests({
                          ...tests,
                          [m.id]: { ...t, questions: e.target.value },
                        })
                      }
                    />
                  </label>
                  <button>Publish assessment</button>
                </form>
              </details>
              {m.assessments?.map((a) => (
                <div className="assessment-review" key={a.id}>
                  <div className="assessment-row">
                    <StatusBadge status={a.type} />
                    <strong>{a.title}</strong>
                    <small>{a.dueAt ? `Due ${new Date(a.dueAt).toLocaleString()}` : "No closing date"}</small>
                    <button className="quiet-button" onClick={() => review(a.id)}>Review submissions</button>
                  </div>
                  {submissions[a.id]?.map((item) => <div className="submission-row" key={item.id}><span><b>{item.student.name}</b><small>{item.student.email} · {item.status}</small></span><span>{item.score === null ? "Not graded" : `${item.score}/${a.maxScore}`}</span><button onClick={() => grade(item, a.maxScore)}>Grade</button></div>)}
                  {submissions[a.id]?.length === 0 && <p className="muted">No learner submissions yet.</p>}
                </div>
              ))}
            </section>
          );
        })}
      </div>
    </DashboardShell>
  );
}
