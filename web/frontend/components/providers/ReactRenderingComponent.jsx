import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dark } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import MarkdownIt from "markdown-it";
import ReactMarkdown from "react-markdown";
import remarkEmoji from "remark-emoji";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import markdownItSanitizer from "markdown-it-sanitizer";
const containerStyle = {
  maxWidth: "400px", // Set a maximum width for the container
  margin: "0 auto", // Center the container horizontally
  padding: "20px", // Add some padding for spacing
};
export function addMarkup(plainText) {
  const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    remarkPlugins: [remarkMath, remarkGfm, remarkEmoji],
    rehypePlugins: [rehypeKatex, rehypeRaw, rehypeSanitize],
  });

  md.use(markdownItSanitizer, {
    imageClass: "img-responsive",
    removeUnbalanced: true,
    removeUnknown: false,
    allowedSchemesByTag: {
      a: ["http", "https"],
      img: ["data"],
    },
    allowedClasses: {
      div: ["my-class", "other-class"],
      p: ["my-paragraph"],
    },
    allowedAttributes: {
      a: ["href", "title", "target"],
      img: ["src", "alt"],
    },
    allowedSchemesAppliedToAttributes: {
      src: ["http", "https", "data"],
    },
  });
  const result = md.render(plainText);
  return result;
}

export function ReactRenderingComponent({ text }) {
  if (!text) return null;
  const Iframe = addMarkup(text);

  return (
    <div style={{ width: "100%" }}>
      <div dangerouslySetInnerHTML={{ __html: Iframe }} />
    </div>
  );
}



export function RemoveHtml({}){
  
}