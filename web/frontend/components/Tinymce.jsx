import debounce from "lodash.debounce";
import React, { useRef, useEffect, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";

import tinymce from "tinymce/tinymce";
import "tinymce/plugins/autoresize";
import "tinymce/plugins/code/plugin";
import "tinymce/plugins/image/plugin";
import "tinymce/plugins/link/plugin";
import "tinymce/plugins/emoticons/plugin";
import "tinymce/plugins/emoticons/js/emojis";
import "tinymce/plugins/wordcount/plugin";
import "tinymce/models/dom/model";
import "tinymce/skins/content/default/content.css";
import "tinymce/skins/content/default/content.min.css";
import "tinymce/skins/ui/oxide/skin.min.css";
import "tinymce/skins/ui/oxide/content.min.css";
import "tinymce/themes/silver";
import "tinymce/icons/default";

// importing the plugin js.
import "tinymce/plugins/advlist";
import "tinymce/plugins/autolink";
import "tinymce/plugins/link/plugin";
import "tinymce/plugins/image";
import "tinymce/plugins/lists";
import "tinymce/plugins/charmap";

import "tinymce/plugins/anchor";
import "tinymce/plugins/searchreplace";
import "tinymce/plugins/wordcount";
import "tinymce/plugins/code";
import "tinymce/plugins/fullscreen";
import "tinymce/plugins/insertdatetime";
import "tinymce/plugins/media";
import "tinymce/plugins/nonbreaking";
import "tinymce/plugins/table";
import "tinymce/plugins/template";
import "tinymce/plugins/help";

// import { Editor as TinyMCEEditor, EditorEvent } from 'tinymce';

// import contentCss from "tinymce/skins/content/default/content.min.css?inline";
// import contentUiCss from "tinymce/skins/ui/oxide/content.min.css?inline";
// import oxide_skin from "tinymce/skins/ui/oxide/skin.min.css?inline";
// import oxide_content from "tinymce/skins/ui/oxide/content.min.css?inline";








const dfreeHeaderConfig = {
  selector: ".dfree-header",
  menubar: false,
  inline: true,
  toolbar: false,
  plugins: ["quickbars"],
  quickbars_insert_toolbar: "undo redo",
  quickbars_selection_toolbar: "italic underline",
};

const dfreeBodyConfig = {
  selector: ".dfree-body",
  menubar: false,
  inline: true,
  plugins: [
    "autolink",
    "codesample",
    "link",
    "lists",
    "media",
    "powerpaste",
    "table",
    "image",
    "quickbars",
    "codesample",
    "help",
  ],
  toolbar: false,
  quickbars_insert_toolbar: "quicktable image media codesample",
  quickbars_selection_toolbar:
    "bold italic underline | blocks | blockquote quicklink",
  contextmenu: "undo redo | inserttable | cell row column deletetable | help",
  powerpaste_word_import: "clean",
  powerpaste_html_import: "clean",
};
tinymce._setBaseUrl("/tinymce");
console.log("tinymce", tinymce);

// tinymce.on("beforerenderui", function () {
//   // Get the document base URL
//   const baseUrl = editor.documentBaseURI.toAbsolute("");
//   console.log("baseUrl**********", baseUrl);
//   // Intercept and modify requests for static resources
//   editor.contentCSS = editor.contentCSS.map((url) => {
//     // Modify the URL as needed
//     //  return modifyUrl(url);
//   });
// });
export function Tinymce({ initialValue, onEditorChange }) {
  const editorRef = useRef(null);

  const [dirty, setDirty] = useState(false);
  useEffect(() => setDirty(false), [initialValue]);
  const save = () => {
    if (editorRef.current) {
      const content = editorRef.current.getContent();
      setDirty(false);
      editorRef.current.setDirty(false);
      // an application would save the editor content to the server here
   
    }
  };
  if (!onEditorChange) {
    onEditorChange = function (edit) {
      console.log("edit", edit);
    };
  }

  // useEffect(() => {
  //   if (editorRef.current) {

  return (
    <>
      <Editor
        tagName="section"
        // inline={true}
        rollback={0}
        onInit={(evt, editor) => (editorRef.current = editor)}
        scriptLoading={{
          // async?: boolean;
          // defer?: boolean;
          delay: 600,
        }}
        onDirty={() => setDirty(true)}
        initialValue="<p>This is the initial content of the editor.</p>"
        init={{
          branding: false,
          promotion: false,
          // relative_urls: false,
          // remove_script_host: false,
          // convert_urls: false,
          document_base_url: API_URL,
          // target: editorRef.current,
          // plugins: [
          //   "advlist autolink lists link image charmap print preview anchor",
          //   "searchreplace visualblocks code fullscreen",
          //   "insertdatetime media table paste code help wordcount",
          // ],
          plugins: [
            "autosave",
            "lists",
            "autolink",
            "link image",
            "image",
            "quickbars",
          ],
          menubar: true,
          toolbar: "undo redo | bold italic | link image",
          //  content_style: 'body { font-family: Arial, sans-serif; }',
          //skin_url:'tinymce/skins/content/default/content.min.css',
          // skin: false,
          // content_css: false,
          draggable_modal: false,
          theme: true,
          autoresize_bottom_margin: 5,
          // content_style: [
          //   contentCss,
          //   contentUiCss,
          //   oxide_skin,
          //   oxide_content,
          // ].join("\n"),
          file_picker_callback: function (callback, value, meta) {
            // Provide file and text for the link dialog
            if (meta.filetype == "file") {
              callback("mypage.html", { text: "My text" });
            }

            // Provide image and alt text for the image dialog
            if (meta.filetype == "image") {
              callback(value, { alt: "My alt text" });
            }

            // Provide alternative source and posted for the media dialog
            if (meta.filetype == "media") {
              callback("movie.mp4", {
                source2: "alt.ogg",
                poster: "image.jpg",
              });
            }
          },
          setup: (editor) => {
            // Listen for changes in the image upload dialog
            editor.on("ImageDialogChangeEvent", (e) => {
              const imageUrl = e.data.imageurl; // URL of the uploaded image
              console.log("Image URL changed:", imageUrl);
            });

            // Listen for changes in the link input dialog
            editor.on("LinkDialogChangeEvent", (e) => {
              const linkUrl = e.data.link; // URL entered in the link input
            
            });

            editor.on("dialogClosed", (e) => {
              // Check if the closed dialog is the "Insert Image" dialog
              if (e.dialog === "image") {
                // Re-enable the editor after the "Insert Image" dialog is closed
                editor.setMode("design");
              }
            });
            // Debounce the input event with a 300ms delay
            const debouncedInputHandler = debounce(() => {
              const content = editor.getContent();
              console.log("content", content);
              onEditorChange(content);
            }, 300);

            editor.on("input", debouncedInputHandler);
          },
          mobile: {
            menubar: true,
            plugins: ["autosave", "lists", "autolink", "link image", "image"],
            toolbar: ["undo", "bold", "italic", "styleselect"],
          },
          min_height: 500,
          height: 500,
        }}
      />
    </>
  );
  //     if (initialValue) {
  //       tinymce.activeEditor.setContent(initialValue);
  //     }
  //   }

  //   return () => {
  //     if (editorRef.current) {
  //       tinymce.get(editorRef.current.id).destroy();
  //     }
  //   };

  //  return <textarea ref={editorRef} />;
}
// let instance;

// export function Tinymce({ initialValue, onEditorChange }) {
//   const editorRef = useRef(null);
//   // const [editor, setEditor] = useState(null);

//   useEffect(async () => {

// if (instance){
//   instance.activeEditor.target= editorRef.current;
// }

//     if (editorRef.current && !instance) {

//       instance = tinymce;
//  instance.init({
//         target: editorRef.current,
//         plugins: "link image",
//         toolbar: "undo redo | bold italic | link image",
//         allow_script_urls: false,
//         convert_urls: false,
//         // content_css: false,
//         // relative_urls:false,
//         remove_script_host: true,
//         // document_base_url: API_URL,
//         // Set the minimum height of the editor's content area
//         min_height: 300, // You can adjust this value as needed
//         convertURL: function (url, node, on_save, name) {
//           // Do some custom URL conversion
//           // url = url.substring(3);
//           console.log("url on save", url);
//           // Return new URL
//           return url;
//         },
//         init_instance_callback: function (editor) {
//           // const baseUrl = editor.documentBaseURI.toAbsolute("");
//           // console.log("baseurl: " + baseUrl);
//           // // Intercept and modify resource requests
//           // // Modify resource URLs before rendering the UI
//           // editor.contentCSS = editor.contentCSS.map((url) => {
//           //   // Modify the URL as needed
//           //   if (url) {
//           //     console.log(" intial url-->", url);
//           //     url = url.replace(".com//", ".com/tinymce/");
//           //     return url;
//           //   }
//           // });
//           // editor.on("beforerenderui", function () {
//           //   // Get the document base URL
//           //   const baseUrl = editor.documentBaseURI.toAbsolute("");
//           //   console.log("baseUrl before render**********", baseUrl);
//           //   // Intercept and modify requests for static resources
//           //   editor.contentCSS = editor.contentCSS.map((url) => {
//           //     // Modify the URL as needed
//           //     //  return modifyUrl(url);
//           //     return url;
//           //   });
//           // Modify other resource URLs as needed
//           // editor.someResourceURL = modifyUrl(editor.someResourceURL);
//           // });
//           // any interaction activates active listener
//           // editor.on("activate", function () {
//           //   // Get the document base URL
//           //   const baseUrl = editor.documentBaseURI.toAbsolute("");
//           //   console.log("baseUrl*on activate*********", baseUrl);
//           //   // Intercept and modify requests for static resources
//           //   editor.contentCSS = editor.contentCSS.map((url) => {
//           //     // Modify the URL as needed
//           //     //  return modifyUrl(url);
//           //     return url;
//           //   });
//           // Modify other resource URLs as needed
//           // editor.someResourceURL = modifyUrl(editor.someResourceURL);
//           // });
//           // editor.on("beforeexeccommand", function () {
//           //   // Get the document base URL
//           //   const baseUrl = editor.documentBaseURI.toAbsolute("");
//           //   console.log("baseUrl****before execute******", baseUrl);
//           //   // Intercept and modify requests for static resources
//           //   editor.contentCSS = editor.contentCSS.map((url) => {
//           //     // Modify the URL as needed
//           //     //  return modifyUrl(url);
//           //   });
//           // Modify other resource URLs as needed
//           // editor.someResourceURL = modifyUrl(editor.someResourceURL);
//           // });
//         },
//         contentCss: [
//           // contentCss,
//           // contentUiCss,
//           // oxide_skin,
//           // oxide_content,
//         ].join("\n"),
//         content_style: [
//           // contentCss,
//           // contentUiCss,
//           // oxide_skin,
//           // oxide_content,
//         ].join("\n"),
//         file_picker_callback: function (callback, value, meta) {
//           // Provide file and text for the link dialog
//           if (meta.filetype == "file") {
//             callback("mypage.html", { text: "My text" });
//           }

//           // Provide image and alt text for the image dialog
//           if (meta.filetype == "image") {
//             callback(value, { alt: "My alt text" });
//           }

//           // Provide alternative source and posted for the media dialog
//           if (meta.filetype == "media") {
//             callback("movie.mp4", {
//               source2: "alt.ogg",
//               poster: "image.jpg",
//             });
//           }
//         },
//         setup: (editor) => {
//           // editor.on("activate", function () {
//           //   // Get the document base URL
//           //   const baseUrl = editor.documentBaseURI.toAbsolute("");
//           //   console.log("baseUrl**********", baseUrl);
//           //   // Intercept and modify requests for static resources
//           //   editor.contentCSS = editor.contentCSS.map((url) => {
//           //     // Modify the URL as needed
//           //     //  return modifyUrl(url);
//           //     return url;
//           //   });

//           //   // Modify other resource URLs as needed
//           //   // editor.someResourceURL = modifyUrl(editor.someResourceURL);
//           // });

//           // editor.on("beforeexeccommand", function () {
//           //   // Get the document base URL
//           //   const baseUrl = editor.documentBaseURI.toAbsolute("");
//           //   console.log("baseUrl***activate*******", baseUrl);
//           //   // Intercept and modify requests for static resources
//           //   editor.contentCSS = editor.contentCSS.map((url) => {
//           //     // Modify the URL as needed
//           //     console.log('activae url css', url)
//           //     return url;

//           //     //  return modifyUrl(url);
//           //   });

//           // });

//           // editor.on("beforerenderui", function () {
//           //   // Get the document base URL
//           //   const baseUrl = editor.documentBaseURI.toAbsolute("");
//           //   console.log("baseUrl---->", baseUrl);
//           //   // Intercept and modify requests for static resources
//           //   editor.contentCSS = editor.contentCSS.map((url) => {
//           //     // Modify the URL as needed
//           //     return modifyUrl(url);
//           //   });

//           //   // Modify other resource URLs as needed
//           //   // editor.someResourceURL = modifyUrl(editor.someResourceURL);
//           // });

//           // editor.on("input", () => {
//           //   const content = editor.getContent();
//           //   onEditorChange(content);
//           // });
//           // Listen for changes in the image upload dialog
//           // editor.on("ImageDialogChangeEvent", (e) => {
//           //   const imageUrl = e.data.imageurl; // URL of the uploaded image
//           //   console.log("Image URL changed:", imageUrl);
//           // });

//           // Listen for changes in the link input dialog
//           // editor.on("LinkDialogChangeEvent", (e) => {
//           //   const linkUrl = e.data.link; // URL entered in the link input
//           //   console.log("Link URL changed:", linkUrl);
//           // });

//           // editor.on("dialogClosed", (e) => {
//           //   // Check if the closed dialog is the "Insert Image" dialog
//           //   if (e.dialog === "image") {
//           //     // Re-enable the editor after the "Insert Image" dialog is closed
//           //     editor.setMode("design");
//           //   }
//           // });
//           // Debounce the input event with a 300ms delay
//           const debouncedInputHandler = debounce(() => {
//             const content = editor.getContent();
//             console.log("content", content);
//             onEditorChange(content);
//           }, 300);

//           editor.on("input", debouncedInputHandler);
//         },
//         mobile: {
//           menubar: false,
//           plugins: [
//             "autosave",
//             "lists",
//             "autolink",
//             "link image",
//             "image",
//             "quickbars",
//           ],
//           toolbar: false, // ["undo", "bold", "italic", "styleselect"],
//         },
//       });

//       instance.activeEditor.on("input", () => {
//         const content = instance.activeEditor.getContent();
//         console.log('content-->', content)
//      //   onEditorChange(content);
//       });

//     }
//     instance.activeEditor.setContent( initialValue);

//        return () => {
//       if (editorRef.current) {
//         instance.get(editorRef.current.id).destroy();
//         instance= null;
//       }
//     };
//   }, []);

//   useEffect( async () => {
// console.log('initialValue', initialValue);
//     if (instance && initialValue !== instance.activeEditor.getContent()) {
//    const currentContent =  instance.activeEditor.getContent()
//       instance.activeEditor.setContent( initialValue);
//     }

//     return () => {
//       if (editorRef.current) {
//         instance.get(editorRef.current.id).destroy();
//         instance= null;
//       }
//     };

//   }, [initialValue, instance]);

//   return <textarea ref={editorRef} />;
// }
