import { faqs } from "../../data/siteContent";
export default function FAQ(){return <main className="container page"><p className="eyebrow">Information</p><h1>Frequently asked questions.</h1><div className="faq-list">{faqs.map(([question,answer])=><details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div></main>}
