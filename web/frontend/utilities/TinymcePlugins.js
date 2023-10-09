import { ellipseSharp } from "ionicons/icons";
import debounce from "lodash.debounce";
// import React, { useRef, useEffect, useState } from "react";
// import { Editor } from "@tinymce/tinymce-react";

// import tinymce from "tinymce/tinymce";
// import "tinymce/plugins/autoresize";
// import "tinymce/plugins/code/plugin";
// import "tinymce/plugins/image/plugin";
// import "tinymce/plugins/link/plugin";
// import "tinymce/plugins/emoticons/plugin";
// import "tinymce/plugins/emoticons/js/emojis";
// import "tinymce/plugins/wordcount/plugin";
// import "tinymce/models/dom/model";
// import "tinymce/skins/content/default/content.css";
// import "tinymce/skins/content/default/content.min.css";
// import "tinymce/skins/ui/oxide/skin.min.css";
// import "tinymce/skins/ui/oxide/content.min.css";
// import "tinymce/themes/silver";
// import "tinymce/icons/default";

// importing the plugin js.
// import "tinymce/plugins/advlist";
// import "tinymce/plugins/autolink";
// import "tinymce/plugins/link/plugin";
// import "tinymce/plugins/image";
// import "tinymce/plugins/lists";
// import "tinymce/plugins/charmap";

// import "tinymce/plugins/anchor";
// import "tinymce/plugins/searchreplace";
// import "tinymce/plugins/wordcount";
// import "tinymce/plugins/code";
// import "tinymce/plugins/fullscreen";
// import "tinymce/plugins/insertdatetime";
// import "tinymce/plugins/media";
// import "tinymce/plugins/nonbreaking";
// import "tinymce/plugins/table";
// import "tinymce/plugins/template";
// import "tinymce/plugins/help";

// import { Editor as TinyMCEEditor, EditorEvent } from 'tinymce';

// import contentCss from "tinymce/skins/content/default/content.min.css?inline";
// import contentUiCss from "tinymce/skins/ui/oxide/content.min.css?inline";
// import oxide_skin from "tinymce/skins/ui/oxide/skin.min.css?inline";
// import oxide_content from "tinymce/skins/ui/oxide/content.min.css?inline";

export function tinymceCustomPlugins(tinymce) {
  tinymce.PluginManager.add("streamingai", function (editor) {
    // Create a custom context menu item
    editor.ui.registry.addMenuItem("neuralnectar", {
      text: "neuralnectar",
      onAction: function () {
        // Function to insert text at the current cursor position
        function insertTextAtCursor(text) {
          const content = editor.getContent();
          const selection = editor.selection;
          const range = selection.getRng();

          if (range) {
            const tempDiv = editor.dom.create("div");
            tempDiv.innerHTML = text;
            console.log("range", editor.getDoc().createTextNode(text));
            // Insert the text at the current cursor position
            //  editor.getDoc().createTextNode(text)

            range.insertNode(tempDiv);
          }
          // Update the editor content
          // editor.setContent(content);
        }

        // Insert your desired text
        insertTextAtCursor("<h1>Hello Asif CEO Incorporated Guy!  😃🚀</h1>");
      },
    });

    // Create a context menu with the custom item
    editor.ui.registry.addContextMenu("customContextMenu", {
      update: function (element) {
        return !element.classList.contains("mce-image");
      },
    });

    // Add the custom item to the context menu
    // editor.ui.registry.addContextMenuItem('customInsertText', {
    //   context: 'customContextMenu',
    // });

    // Listen for contextmenu event
    // editor.on('contextmenu', function (e) {
    //   // Prevent the default context menu
    //   e.preventDefault();

    //   // Show the custom context menu
    //   editor.contextMenu.showMenuAt(e.clientX, e.clientY);
    // });

    return {
      getMetadata: function () {
        return {
          name: "Custom Context Menu Plugin",
        };
      },
    };
  });
}

const menubarConfig = {
  menubar: "file edit view insert format tools table code",
  menu: {
    code: { title: "Edit Source Code", items: "code" },
  },
  // toolbar_location: 'bottom',
  //  menubar: true,
  // menubar_sticky: true,

  resize: "both",
  resize_img_proportional: true,
  toolbar: [
    "undo redo link | media| image | table | wordcount ",
    "forecolor backcolor | bold italic underline | fontfamily fontsize",
    "alignleft aligncenter alignright alignfull | numlist bullist outdent indent | emoticons | accordion |insertdatetime",
  ],
  statusbar: true,
  toolbar_sticky: true,
};

async function isValidImageUrl(url) {
  return await new Promise((resolve) => {
    const image = new Image();

    image.onload = function () {
      if (this.width > 0) {
        resolve(true); // Image exists
      } else {
        resolve(false); // Image doesn't exist
      }
    };

    image.onerror = function () {
      resolve(false); // Image doesn't exist
    };

    image.src = url;
  });
}

const page1Config = {
  title: "Select an Article Image Header",
  body: {
    type: "panel",
    items: [
      {
        type: "htmlpanel",
        html: "<p>Redial allows for the contents of a dialog to be replaced with new contents. This can be used to create multipage form dialogs.</p><br/><p>The Next button is initially disabled. When the <strong>checkbox</strong> is checked, the Next button should be enabled.</p>",
      },
      {
        type: "urlinput",
        name: "src",
        filetype: "image",
        label: "Source",
        level: "warn",
      },
      {
        type: "htmlpanel",
        html: "<p>Pressing the Next button will call redial() to reload the dialog with the next page of the form.</p><br><p>Press Next to continue.</p>",
      },
    ],
  },
  initialData: {
    anyterms: false,
  },
  buttons: [
    {
      type: "custom",
      name: "doesnothing",
      text: "Previous",
      enabled: false,
    },
    {
      type: "custom",
      name: "uniquename",
      text: "Next",
      enabled: false,
    },
  ],
  onChange: async (dialogApi, details) => {
    const data = dialogApi.getData();
    /* Example of enabling and disabling a button, based on the checkbox state. */
    console.log("data", data);
    const isValidImag = await isValidImageUrl(data.value);

    console.log("isValidImg", isValidImag);
    if (isValidImag) {
      dialogApi.setEnabled("uniquename", data.anyterms);
    }
  },
  onAction: (dialogApi, details) => {
    console.log("action made", details);
    if (details.name === "uniquename") {
      dialogApi.redial(page2Config);
    } else if (details.name === "doesnothing") {
      /* this case should never be met as the button is never enabled. */
    }
  },
};

const page2Config = {
  title: "Redial Demo - Page 2",
  body: {
    type: "panel",
    items: [
      {
        type: "selectbox",
        name: "choosydata",
        label: "Choose a pet",
        items: [
          { value: "meow", text: "Cat" },
          { value: "woof", text: "Dog" },
          { value: "thunk", text: "Rock" },
        ],
      },
      {
        type: "htmlpanel",
        html: "<p>Click done and the dialog will log a message to the console, insert a sentence into the editor and close.</p>",
      },
    ],
  },
  buttons: [
    {
      type: "custom",
      name: "lastpage",
      text: "Done",
      enabled: true,
    },
  ],
  initialData: {
    choosydata: "",
  },
  onAction: (dialogApi, details) => {
    const data = dialogApi.getData();

    const result = "You chose wisely: " + data.choosydata;
    console.log(result);
    tinymce.activeEditor.execCommand(
      "mceInsertContent",
      false,
      `<p>${result}</p>`
    );

    dialogApi.close();
  },
};

function autosaveContent(editor) {
  const content = editor.getContent();
  localStorage.setItem("autosaveContent", content);
  // console.log(" Editor Content autosaved to localStorage:");
}
export function quicksBarConfig(eventEmitter) {
  // console.log(" eventEmitter: " , eventEmitter);

  return {
    // log_level: 'warn',
    menubar: false,
    toolbar: false,
    // toolbar:" title-Image ",
    toolbar_mode: "scrolling",
    quickbars_insert_toolbar:
      "quicktable image media bullist numlist indent outdent emoticons accordion template insertdatetime",
    quickbars_selection_toolbar:
      "fontfamily fontsize bold italic underline | formatselect | blockquote quicklink",
    contextmenu:
      "undo redo | inserttable | alignleft aligncenter alignright alignfull | | cell row column deletetable | wordcount| image media | emoticons | forecolor backcolor | template | neuralnectar aligncenter alignjustify alignleft alignnone alignright| anchor | blockquote blocks | backcolor | bold | copy | cut | fontfamily fontsize forecolor h1 h2 h3 h4 h5 h6 hr indent | italic | language | lineheight | newdocument | outdent | paste pastetext | print | redo | remove removeformat | selectall | strikethrough | styles | subscript superscript underline | undo | visualaid | a11ycheck advtablerownumbering typopgraphy anchor restoredraft casechange charmap checklist code codesample addcomment showcomments ltr rtl editimage fliph flipv imageoptions rotateleft rotateright emoticons export footnotes footnotesupdate formatpainter fullscreen help image insertdatetime link openlink unlink bullist numlist media mergetags mergetags_list nonbreaking pagebreak pageembed permanentpen preview quickimage quicklink quicktable cancel save searchreplace spellcheckdialog spellchecker | table tablecellprops tablecopyrow tablecutrow tabledelete tabledeletecol tabledeleterow tableinsertdialog tableinsertcolafter tableinsertcolbefore tableinsertrowafter tableinsertrowbefore tablemergecells tablepasterowafter tablepasterowbefore tableprops tablerowprops tablesplitcells tableclass tablecellclass tablecellvalign tablecellborderwidth tablecellborderstyle tablecaption tablecellbackgroundcolor tablecellbordercolor tablerowheader tablecolheader | tableofcontents tableofcontentsupdate | template typography | insertfile | visualblocks visualchars | wordcount",

    powerpaste_word_import: "clean",
    powerpaste_html_import: "clean",
    template_mdate_format: "%m/%d/%Y : %H:%M",
    template_replace_values: {
      username: "Jack Black",
      staffid: "991234",
      inboth_username: "Famous Person",
      inboth_staffid: "2213",
    },
    template_preview_replace_values: {
      preview_username: "Jack Black",
      preview_staffid: "991234",
      inboth_username: "Famous Person",
      inboth_staffid: "2213",
    },
    templates: [
      {
        title: "Closing tickets",
        description:
          "Adds a timestamp indicating the last time the document modified.",
        content:
          '<p>Last Modified: <time class="mdate">This will be replaced with the date modified.</time></p>',
      },
      {
        title: "Support escalation",
        description:
          "These values will be replaced when the template is inserted into the editor content.",
        content: "<p>Name: {$username}, StaffID: {$staffid}</p>",
      },
      {
        title: "Post-call survey",
        description:
          "These values are replaced in the preview, but not when inserted into the editor content.",
        content:
          "<p>Name: {$preview_username}, StaffID: {$preview_staffid}</p>",
      },
      {
        title: "Replace values preview and content example",
        description:
          "These values are replaced in the preview, and in the content.",
        content: "<p>Name: {$inboth_username}, StaffID: {$inboth_staffid}</p>",
      },
      {
        title: "How to find model number",
        content:
          '<p dir="ltr">Hi ,</p>\n<p><strong>&nbsp;</strong></p>\n<p dir="ltr">My name is  and I will be glad to assist you today.</p>\n<p dir="ltr">To troubleshoot your issue, we first need your model number, which can be found on the underside of your product beneath the safety warning label.&nbsp;</p>\n<p dir="ltr">It should look something like the following: XX.XXXXX.X</p>\n<p dir="ltr">Once you send it over, I will advise on next steps.</p>\n<p><strong>&nbsp;</strong></p>\n<p dir="ltr">Thanks!</p>\n<p dir="ltr"></p>',
      },
      {
        title: "Support escalation",
        content:
          '<p dir="ltr"><img src="https://lh3.googleusercontent.com/z4hleIymnERrS9OQQMBwmkqVne8kYZA0Kly9Ny64pp4fi47CWWUy30Q0-UkjGf-K-50zrfR-wltHUTbExzZ7VUSUAUG60Fll5f2E0UZcKjKoa-ZVlIcuOoe-RRckFWqiihUOfVds7pXtM8Y59uy2hpw" width="295" height="295"></p>\n<p><strong>&nbsp;</strong></p>\n<p dir="ltr">Hi ,</p>\n<p dir="ltr">We have escalated your ticket  to second-level support.</p>\n<p dir="ltr">You should hear back from the new agent on your case, , shortly.</p>\n<p><strong>&nbsp;</strong></p>\n<p dir="ltr">Thanks,</p>\n<p dir="ltr"> Customer Support</p>',
      },
    ],
    content_style:
      "body { font-family:Helvetica,Arial,sans-serif; font-size:16px }",
  
  };
}

// function aiButton(editor) {
//   //   editor.fire("assistFire", {
//   //     newText: "hello world",
//   //     editorView: accordionId,
//   //   });
//   // editor.on("assistFire", (t) => {
//   //   if (t.editorView === accordionId) {
//   //     // let cursor = editor.selection.getBookmark();

//   //     editor.selection.setContent(t.newText);
//   //     //editor.selection.moveToBookmark(cursor);
//   //   }
//   // });

//   editor.plugins.get("ai").register();
//   editor.ui.registry.addButton("ai", {
//     text: "Custom Button",
//     icon: "language",
//     onAction: function () {
//       editor.insertContent("Hello from custom button!");
//     },
//   });
// }

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
// export function Tinymce({ initialValue, onEditorChange }) {
//   const editorRef = useRef(null);

//   const [dirty, setDirty] = useState(false);
//   useEffect(() => setDirty(false), [initialValue]);
//   const save = () => {
//     if (editorRef.current) {
//       const content = editorRef.current.getContent();
//       setDirty(false);
//       editorRef.current.setDirty(false);
//       // an application would save the editor content to the server here

//     }
//   };
//   if (!onEditorChange) {
//     onEditorChange = function (edit) {
//       console.log("edit", edit);
//     };
//   }

//   // useEffect(() => {
//   //   if (editorRef.current) {

//   return (
//     <>
//       <Editor
//         tagName="section"
//         // inline={true}
//         rollback={0}
//         onInit={(evt, editor) => (editorRef.current = editor)}
//         scriptLoading={{
//           // async?: boolean;
//           // defer?: boolean;
//           delay: 600,
//         }}
//         onDirty={() => setDirty(true)}
//         initialValue="<p>This is the initial content of the editor.</p>"
//         init={{
//           branding: false,
//           promotion: false,
//           // relative_urls: false,
//           // remove_script_host: false,
//           // convert_urls: false,
//           document_base_url: API_URL,
//           // target: editorRef.current,
//           // plugins: [
//           //   "advlist autolink lists link image charmap print preview anchor",
//           //   "searchreplace visualblocks code fullscreen",
//           //   "insertdatetime media table paste code help wordcount",
//           // ],
//           plugins: [
//             "autosave",
//             "lists",
//             "autolink",
//             "link image",
//             "image",
//             "quickbars",
//           ],
//           menubar: true,
//           toolbar: "undo redo | bold italic | link image",
//           //  content_style: 'body { font-family: Arial, sans-serif; }',
//           //skin_url:'tinymce/skins/content/default/content.min.css',
//           // skin: false,
//           // content_css: false,
//           draggable_modal: false,
//           theme: true,
//           autoresize_bottom_margin: 5,
//           // content_style: [
//           //   contentCss,
//           //   contentUiCss,
//           //   oxide_skin,
//           //   oxide_content,
//           // ].join("\n"),
//           file_picker_callback: function (callback, value, meta) {
//             // Provide file and text for the link dialog
//             if (meta.filetype == "file") {
//               callback("mypage.html", { text: "My text" });
//             }

//             // Provide image and alt text for the image dialog
//             if (meta.filetype == "image") {
//               callback(value, { alt: "My alt text" });
//             }

//             // Provide alternative source and posted for the media dialog
//             if (meta.filetype == "media") {
//               callback("movie.mp4", {
//                 source2: "alt.ogg",
//                 poster: "image.jpg",
//               });
//             }
//           },
//           setup: (editor) => {
//             // Listen for changes in the image upload dialog
//             editor.on("ImageDialogChangeEvent", (e) => {
//               const imageUrl = e.data.imageurl; // URL of the uploaded image
//               console.log("Image URL changed:", imageUrl);
//             });

//             // Listen for changes in the link input dialog
//             editor.on("LinkDialogChangeEvent", (e) => {
//               const linkUrl = e.data.link; // URL entered in the link input

//             });

//             editor.on("dialogClosed", (e) => {
//               // Check if the closed dialog is the "Insert Image" dialog
//               if (e.dialog === "image") {
//                 // Re-enable the editor after the "Insert Image" dialog is closed
//                 editor.setMode("design");
//               }
//             });
//             // Debounce the input event with a 300ms delay
//             const debouncedInputHandler = debounce(() => {
//               const content = editor.getContent();
//               console.log("content", content);
//               onEditorChange(content);
//             }, 300);

//             editor.on("input", debouncedInputHandler);
//           },
//           mobile: {
//             menubar: true,
//             plugins: ["autosave", "lists", "autolink", "link image", "image"],
//             toolbar: ["undo", "bold", "italic", "styleselect"],
//           },
//           min_height: 500,
//           height: 500,
//         }}
//       />
//     </>
//   );
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
// }
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
//  let selection = editor.selection.getContent();

// newContentElement.scrollIntoView({
//       behavior: 'smooth',
//       block: 'end',
//     })

// Scroll the element into the center view

// const contentLength = editor.getContent();

// var cursorPos = editor.selection.getRng();
// console.log("contentLength", contentLength);
// Set the cursor to the bottom of the editor's content
// editor.selection.setCursorLocation(contentLength.length);

//
//  const newContentElement = editor.selection.getNode();
// // Set the content at the last cursor position
// editor.execCommand('mceInsertContent', false, text);

// // Restore the selection
// editor.selection.setContent(selection);
// editor.selection.setRng(cursorPos);
