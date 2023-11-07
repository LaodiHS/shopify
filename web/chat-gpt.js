// import { schemePastel2 } from "d3-scale-chromatic";
// import { interpolateHsl } from "d3-interpolate";
// import chroma from "chroma-js";
// import * as D3Node from "d3-node";
// const d3 = D3Node.d3;
import pluralize from "pluralize";
// function generatePastelColors(numColors) {
//   if (numColors < 1) {
//     throw new Error("Invalid input parameter.");
//   }

//   const pastelColors = schemePastel2.slice(0, numColors);

//   return pastelColors;
// }
// Example usage:

// function generateColorPalette(numIterations) {
//   let set = new Set();
//   let colors = [];
//   let numColors = Math.pow(2, numIterations + 1) * 3;
//   let k = 1;
//   while (k <= numIterations) {
//     let iterativeCount = k * 6;
//     let i = 0;

//     while (i < iterativeCount) {
//       let color = i * (360 / iterativeCount);
//       i++;
//       if (set.has(color)) continue;
//       set.add(color);
//       colors.push(
//         chroma("hsl(" +
//           color + // Hue range from 0 to 360 (full spectrum)
//           "," +
//           Math.floor(50 + 40 * Math.random()) + // Saturation range from 40 to 90
//           "%," +
//           Math.floor(50 + 20 * Math.random()) + // Lightness range from 40 to 70
//           "%)").hex()
//       );
//     }

//     k++;
//   }

//   return colors;
// }

const colorPalette = ["#dc3232", "#d5d548", "#6cef6c", "#33d7d7", "#2a2ad5", "#de3fde", "#e7b079", "#94cc5c", "#6be1a6", "#2d82d7", "#8f46d8", "#e86dab", "#f4854e", "#e0b661", "#bfeb66", "#a1dd83", "#43d674", "#49e9b4", "#55b3e2", "#1a5fea", "#804aed", "#a051c8", "#f33fb7", "#e2467a", "#d75f37", "#c9af5e", "#c4df72", "#76de54", "#2bde58", "#66ebca", "#67c9e9", "#3c5fc8", "#4a14eb", "#bb73d3", "#c63fa4", "#f1416d", "#e67356", "#e3a378", "#ecb86a", "#d8c164", "#c6d87d", "#a8e44e", "#a1e972", "#73f353", "#16e940", "#51d284", "#59c99d", "#17eec3", "#53b2ca", "#229ef1", "#3d7ad6", "#738bed", "#8872df", "#712ed6", "#9e52d1", "#ae3fca", "#e774d0", "#db3d9c", "#f21c72", "#ef5272", "#e95b3f", "#d9ca7d", "#b9ce50", "#4cf32b", "#3cdd57", "#35d0b6", "#34cbea", "#6d7fd9", "#5133eb", "#dd6df3", "#e151c9", "#d14d63", "#dd5740", "#f48b62", "#dda478", "#da8f2b", "#d8bb74", "#e8d668", "#c8d95e", "#9cc33c", "#b5e576", "#90d959", "#96e576", "#57e43f", "#4dcb5f", "#43db6e", "#68eea1", "#12ed8f", "#5defc5", "#3cecd3", "#7dd5e3", "#43beef", "#71b9ef", "#5295ef", "#4671dd", "#3c51d3", "#391bee", "#8b67e4", "#7e3bd8", "#8c2bd4", "#ca74ec", "#cc88d7", "#e02ec6", "#ef57c4", "#cd5198", "#d43a7c", "#d85a7e", "#d23249", "#e97c6d", "#d48454", "#f0b85c", "#d8c64b", "#c8dd36", "#9bec13", "#74e232", "#4edf3a", "#5ecf6c", "#5dea92", "#2de19e", "#63d4c6", "#36d1e7", "#1d98e2", "#4e7bc6", "#3b4fd8", "#402bd4", "#7841d2", "#a964d3", "#d746ec", "#d05dc2", "#dc60ae", "#f5518f", "#eb1e37", "#eb7d6f", "#f46a43", "#ca8b58", "#c9914a", "#d6c380", "#d8cb64", "#dded5e", "#c6f132", "#b7f26e", "#9eee5d", "#62d841", "#68ef57", "#5aed6a", "#5cf07d", "#34ea85", "#6fe2af", "#49eec9", "#38dcca", "#1ccde3", "#15beef", "#2792e7", "#428ff0", "#5671d2", "#5061e7", "#7464f2", "#6f53d0", "#a975ea", "#b07dd9", "#b75cd1", "#be4ccd", "#d978ce", "#d629b0", "#c85b97", "#d54484", "#f33963", "#f06675", "#f67365", "#cf673a", "#e6bd5b", "#f4e243", "#c8da25", "#a8d246", "#5feb24", "#3dd82c", "#78d981", "#75e697", "#68f3c9", "#4defdf", "#54c7d4", "#62c8f3", "#2b67f3", "#4150d8", "#2913ec", "#673dc7", "#ab59cf", "#d07dd9", "#e331d1", "#d544a9", "#e34574", "#e5616e", "#e23d2c", "#e2907e", "#e8754a", "#ee8244", "#e28436", "#eb8914", "#e6a128", "#d6c085", "#d9c87d", "#f3e76d", "#f0f060", "#e0eb6f", "#bfe029", "#c6f250", "#a8f226", "#97d44e", "#91f141", "#85d558", "#8cde6e", "#5ee141", "#5ccd51", "#6ce46c", "#24e535", "#56c86a", "#76e594", "#2bd469", "#84dbac", "#67d5a3", "#62f3bf", "#7cdec4", "#3fd9bd", "#30dfcf", "#7dd9e3", "#40a8bf", "#49c5f3", "#7fb7d7", "#75aad7", "#7ea7d7", "#6f93d3", "#6080d7", "#425bcd", "#8189d9", "#3333d1", "#685ce6", "#6a51d6", "#7e52f4", "#864bec", "#a065e6", "#a75de5", "#9d42d1", "#b113ec", "#c920ee", "#dd13f1", "#d54dc9", "#d77ec7", "#f056c6", "#e633a5", "#e03e96", "#db4388", "#ef2a71", "#ce5f7d", "#df5d75", "#d47780", "#eb7166", "#eb7f33", "#deb57d", "#cec34b", "#dce765", "#aada67", "#88dd4b", "#69f55c", "#47f055", "#6fd89a", "#39eaa0", "#5acec4", "#3cddec", "#61b4ef", "#5694eb", "#5864ee", "#3d2df0", "#9766db", "#9835de", "#bb49c5", "#f32be2", "#df81b8", "#eb1971", "#c94550", "#d2392d", "#f04b2d", "#e98567", "#f0540f", "#f37b30", "#d29560", "#e78f27", "#f0a733", "#e9ad25", "#d6be6b", "#ebca14", "#e8db45", "#dde94e", "#c2d364", "#c9ef4e", "#bdef4e", "#bbe080", "#9bd15c", "#9fd86f", "#8dea53", "#7acf54", "#8ceb6f", "#7ae566", "#45db39", "#58d061", "#55ec6c", "#4ac968", "#73e295", "#66ea99", "#6edea1", "#40e298", "#66f4be", "#48d5aa", "#31f2c5", "#45f2d7", "#33f0e1", "#53f3f3", "#87d3d9", "#75d9eb", "#35bfe9", "#2baee9", "#78b7de", "#55a4e7", "#2b7ede", "#4c87e6", "#6687d1", "#6583e6", "#687adf", "#707af0", "#4235e3", "#6751db", "#947edd", "#8463cf", "#8755d8", "#7824db", "#8536c9", "#a549df", "#b779d2", "#c43aee", "#d96eed", "#e176ea", "#e071d7", "#f26ede", "#ef3ec6", "#e916a8", "#f21ca0", "#db80b1", "#dd4089", "#d93674", "#cd4770", "#f01447", "#e7405a", "#c24751", "#ec7c74", "#f35a30", "#dd8555", "#ddb66e", "#d5b130", "#d0c86d", "#dae453", "#aec851", "#bbf25a", "#6ae326", "#89e76f", "#33e925", "#78e37f", "#47e669", "#75ea9f", "#7ae1bc", "#69ddc4", "#64cec6", "#18d8e7", "#32bce2", "#3ca3dd", "#517fd2", "#8093db", "#5b62c8", "#7f77e9", "#775dd5", "#9266e1", "#a115ef", "#ca82de", "#cf60d7", "#dc65d4", "#e641c3", "#e232a3", "#d2376f", "#c83756", "#d96870", "#e4281b", "#ef6752", "#e88a68", "#e2812c", "#deb17d", "#d5ba72", "#e7d350", "#cdc55b", "#cad435", "#daeb70", "#b8e43f", "#aed77e", "#81e52a", "#63ec32", "#54cd42", "#39d12e", "#74ec7c", "#6edd7d", "#2ed65b", "#65eca4", "#34e592", "#31edbb", "#47dcc8", "#5af2e7", "#6ec8cf", "#47c8dc", "#3eb8e5", "#6cace5", "#71a5e0", "#4264c2", "#2f45d0", "#2f3ad0", "#4135de", "#7866f0", "#714bd8", "#7e1eeb", "#ac6ae7", "#b759d9", "#d159e3", "#c14fc9", "#db48d1", "#d926c1", "#e22cb2", "#d65198", "#ef4e99", "#d16b86", "#cc6674", "#e96d75", "#e03429", "#eb3d14", "#c86437", "#e58134", "#e7b26f", "#daab44", "#dfbf34", "#dbd57b", "#c6cd5b", "#c5db66", "#bde368", "#a4ee44", "#87d14d", "#9ae17a", "#86ed6e", "#36ea2a", "#42e04c", "#54d46c", "#20e95f", "#66e19c", "#59eeac", "#6bebc3", "#76d6c4", "#4ae8de", "#36c5ce", "#43c7e5", "#5ec4f3", "#68b0e8", "#68a0e8", "#2f69e9", "#566fdc", "#656cd2", "#3b30df", "#5531f2", "#683cc8", "#7622e2", "#8b3cc8", "#a941d8", "#bf5cd6", "#ec5bf5", "#c738be", "#e41bbe", "#e93fb4", "#f359af", "#d26a98", "#f15586", "#ef153e", "#f4525d", "#e86b64", "#ee614f", "#d78270", "#df5930", "#c56a44", "#ef6215", "#c98a5e", "#d98030", "#ce8b40", "#f6bc6a", "#d6ad61", "#e9b435", "#f1c022", "#e0c33e", "#f5e14d", "#f3ea53", "#bdc445", "#d9f21c", "#d4eb6b", "#c5e16b", "#bce067", "#a3d24b", "#abf443", "#86c144", "#9dd66b", "#92d067", "#6ae029", "#98e278", "#7ee95d", "#93d685", "#62cf54", "#55e64c", "#5cd163", "#6bd678", "#83d892", "#6bd183", "#58da7e", "#40e279", "#44d57f", "#46c883", "#40f29e", "#36f2a5", "#86dabc", "#50f2c2", "#4ee9c5", "#42e0c4", "#6fecdd", "#16e9dd", "#7bdae0", "#47c6d7", "#35c5e3", "#5cc9eb", "#3fa9d5", "#7ebbdd", "#5ba1d2", "#75aee1", "#3f88d9", "#3775cd", "#5a83ce", "#3663ce", "#8497d7", "#5b73e6", "#5d6cda", "#6f76e2", "#544bdd", "#6c5ed9", "#8d7dd9", "#7d5de5", "#6d46c8", "#8554de", "#a581da", "#ad7de3", "#9553d0", "#9752c7", "#a056c8", "#b65cdb", "#c636f2", "#c675d7", "#cd7ed7", "#c92dd2", "#f54deb", "#e029cb", "#ca4eb4", "#e845c2", "#e421aa", "#ef2aa9", "#e31c91", "#d24b93", "#f25fa4", "#db2972", "#d15c85", "#d6436e", "#d2516f", "#c33c54", "#cd6a76", "#e27e84", "#e77f79", "#d98b6d", "#d6a180", "#ec9a18", "#ddac2c", "#d0c958", "#c9d04e", "#a1cb34", "#baef67", "#9df566", "#75e34a", "#7cd477", "#71da77", "#5fe785", "#3bde7a", "#31d394", "#7cdfc4", "#31e3d9", "#2ce2ed", "#4dacd1", "#5db3e9", "#457cd3", "#2c63f2", "#5f66dd", "#8681da", "#7653d0", "#9666e1", "#a34fd8", "#ae39db", "#dc68e3", "#de63d7", "#ef61c8", "#dc7ab6", "#ef5d95", "#e23263", "#ec131f", "#e14037", "#e48277", "#d1482e", "#d86c4f", "#e07048", "#d06939", "#d2906a", "#e1945b", "#e8a568", "#e2a25a", "#e29832", "#d3aa64", "#eeaa17", "#e9c153", "#f6d660", "#d6c257", "#e1ce33", "#cac33f", "#ecf45d", "#bdc954", "#d2ef39", "#c7e651", "#c8e27e", "#bee765", "#9cd638", "#a8ed4a", "#b0da81", "#89d147", "#7dc748", "#83c959", "#80ef4e", "#59e925", "#7fe963", "#73e95d", "#63d756", "#62f25a", "#80d684", "#52d15f", "#2ee54b", "#2dd751", "#3cc35f", "#4ff382", "#1de767", "#53d087", "#66d69b", "#6bf5b4", "#66e1ad", "#21eda2", "#5cdbb3", "#6de3c4", "#48f4d0", "#54f2d9", "#49e9d8", "#45d9d1", "#4ed7df", "#3cb5c3", "#24cbeb", "#65cbe7", "#3ca7cd", "#3caadd", "#3895cc", "#6cafe0", "#5c9cd6", "#3287e7", "#84a7d7", "#5a92f2", "#3d6ed6", "#486dd5", "#788cd9", "#1436eb", "#626dcb", "#515af5", "#534af2", "#7367da", "#7c68e3", "#876fe2", "#613cc8", "#6024e0", "#854ce6", "#a473e7", "#9f5ceb", "#b16bef", "#9134d5", "#a131e3", "#b049df", "#ce71ef", "#d25ff1", "#b932d2", "#dd66eb", "#e06fe7", "#e25adb", "#cd51c0", "#ee68d9", "#e637c1", "#e166c0", "#da67b6", "#ed6ebe", "#f060b4", "#d63d8e", "#c8568c", "#d96d9b", "#cb4375", "#d06788", "#ed7393", "#df7289", "#d95e71", "#d83143", "#dd555c", "#d8564f", "#d8533b", "#d2672d", "#e17923", "#c98736", "#eab757", "#d4c363", "#dfd73a", "#e6f028", "#d5ef3e", "#9cdf20", "#8fd539", "#96ce69", "#78f236", "#85d477", "#4bd544", "#33d73b", "#71d17f", "#5fd889", "#30f388", "#60dca4", "#39efaf", "#7fe1d2", "#28dcd3", "#36e9f2", "#78d3e2", "#6ab1d7", "#6bb1eb", "#4b96f1", "#2466e0", "#4456c1", "#8589d6", "#3127e7", "#6856d2", "#9574d2", "#a67cda", "#893fc6", "#b04be7", "#d746f1", "#e82cf2", "#d34acc", "#e279d2", "#e66bbb", "#f660b2", "#d2709c", "#d75683", "#c44f61", "#e2323b", "#dd5b55", "#d64c3d", "#c95a40", "#c97459", "#e19e75", "#e28d40", "#d8974f", "#ca9b4e", "#dbc180", "#f5d261", "#e0c75c", "#d5ca5d", "#d3ce73", "#e2ec18", "#c6d539", "#c9ee2b", "#bfdb66", "#9ae029", "#9cce5a", "#8ce628", "#9ee35f", "#81ec32", "#6ed72d", "#69d747", "#8bec74", "#42d133", "#78e972", "#71e576", "#65d770", "#6bdb7b", "#6cd07f", "#3adf61", "#68e397", "#58d593", "#6edea8", "#6ce5b7", "#44dab6", "#32e7c4", "#50cebc", "#6ed8ce", "#42ebe3", "#35e5ed", "#6fd2dc", "#43bcd0", "#2bc0e3", "#3cb6dd", "#5dbaf4", "#338ee1", "#67a0e0", "#4182ec", "#3e61d0", "#667cdb", "#485ddb", "#4b57ce", "#474feb", "#423ae9", "#4c3af2", "#5f4dcb", "#6648e5", "#592de6", "#855ceb", "#7e3aee", "#9e60e2", "#9c53df", "#a127ec", "#bd55e7", "#bc6dd5", "#ae49c5", "#db14f0", "#e62eef", "#d364ce", "#e826d6", "#cd56b6", "#e175c7", "#db84c3", "#eb2da3", "#e359a1", "#ea539b", "#db4880", "#dd275b", "#ea4d72", "#e17085", "#d74250", "#df5359", "#d94b45", "#e97563", "#f07551", "#dc6c38", "#d2702d", "#daa877", "#e99925", "#d29f32", "#e7bb27", "#d0c05d", "#e8e378", "#e5ed50", "#d2e363", "#d2f263", "#c1eb66", "#a0d454", "#a5dc7f", "#89e260", "#50e524", "#2fee11", "#38cf30", "#76db7b", "#48cb5a", "#57ea79", "#48d575", "#3ad97b", "#4ae3a4", "#5dd5af", "#35d4b0", "#41f1d9", "#5ec9c5", "#62d5da", "#43c2d6", "#21bfed", "#1daaed", "#2995e0", "#4f8cc9", "#74a1e2", "#386ee0", "#486eef", "#4659d2", "#373ed7", "#4741c3", "#7460f0", "#7257cb", "#7b4eda", "#995eed", "#aa4dea", "#c079e2", "#b941dc", "#dc6dee", "#e363e9", "#ce4bc8", "#cd65bf", "#ed6ed0", "#ee53bd", "#f46cbc", "#e82c79", "#e5386f", "#d9637e", "#ef576c", "#d88387", "#e62219", "#d45a4e", "#e3624f", "#cf543a", "#de6645", "#d89d88", "#d06e43", "#cc8966", "#d9783a", "#e08138", "#d79150", "#dd9e5a", "#efb467", "#f0a228", "#d8aa55", "#c6a14e", "#dcb64c", "#d6b84c", "#e6d37a", "#cfbd4a", "#e6d956", "#e0da5c", "#d5dd2c", "#d0d973", "#c7dd36", "#cfe566", "#c5e74b", "#cdef6b", "#c0ea62", "#c1ed6e", "#94c44a", "#a6de5e", "#98f137", "#9cd06d", "#a3d47d", "#74ec27", "#8ede63", "#67e232", "#83d765", "#99d888", "#57c440", "#48ee2f", "#82e779", "#7ce977", "#5fce64", "#62da6c", "#70db7e", "#55e76f", "#4dea6f", "#48c769", "#25ef62", "#6cf49b", "#75d199", "#6be6a0", "#66d199", "#51cd91", "#44da99", "#27dd96", "#70ebc0", "#49f3bf", "#40f2c3", "#6de8ce", "#3bceb4", "#3ad4c0", "#73e2d9", "#26f2e9", "#39ebf3", "#58e6f3", "#53def3", "#70d1e6", "#77c8df", "#5cc9f0", "#34b6ef", "#4aa1cf", "#66aad6", "#2294ec", "#6eade7", "#70abeb", "#4685d8", "#0e67f1", "#5787e0", "#1255ed", "#3465ef", "#5e77cf", "#586dd0", "#3e53da", "#6a73d2", "#3f46d9", "#615be1", "#786de3", "#4731dd", "#7c67e0", "#4a21de", "#6841d8", "#8f66ea", "#986de8", "#8745ed", "#8137e1", "#995bdc", "#b074e7", "#9a4ed4", "#b87fdc", "#b951f0", "#be72df", "#b547dc", "#d568f3", "#c956e1", "#cd76db", "#c839d5", "#d735de", "#e660e0", "#e859dc", "#ef2ad5", "#e651cc", "#d93fb8", "#d459b4", "#d93faa", "#f56bc5", "#e92fa0", "#ca4e94", "#ef2e93", "#ef3990", "#d05d8f", "#dc6594", "#e4497f", "#d72d61", "#ce4b6d", "#cb3455", "#ca445b", "#cf6371", "#db3947", "#e2555b"]

// Set up the API endpoint URL

// Set the data payload containing the prompt
//   temperature: Controls the randomness of the generated text. A higher value like 0.8 will produce more random and creative responses, while a lower value like 0.2 will make the output more focused and deterministic.

// max_tokens: Specifies the maximum number of tokens in the generated response. This can be used to limit the length of the output.

// top_p (also known as nucleus sampling): It sets a cumulative probability threshold for the generated tokens. The model will keep adding tokens until the cumulative probability exceeds this threshold. This helps in controlling the diversity of the generated text.

// frequency_penalty: A parameter that can be used to discourage repetitive output. Higher values like 2.0 will make the model less likely to repeat the same phrases, while lower values like 0.2 will make it more likely.

// presence_penalty: This parameter encourages the model to include or avoid certain phrases in the generated text. A higher value like 0.8 will make the model more likely to include provided phrases, and a lower value like 0.2 will make it less likely.

// stop: An array of strings that specifies custom stop sequences. The model will stop generating tokens once any of the stop sequences are encountered.
// const apiUrl = `https://api.openai.com/v1/engines/davinci-codex/completions`;

// Set your OpenAI API key

// const data = {
//   prompt: `What is the meaning of life?`,
//   max_tokens: 400,
//   temperature: 0.6,
//   //   top_p: 0.3,
//   //   frequency_penalty: 0.3,
//   presence_penalty: 0.3,
//   stop: [`\n`], // Custom stop sequence
//   format: `html`,
// };

// Set the headers including the authorization header with your API key

// const apiUrl = `https://api.openai.com/v1/chat/completions`;
// const apiKey = `YOUR_API_KEY`;
// const headers = {
//   'Content-Type': 'application/json',
//   'Authorization': `Bearer ${apiKey}`,
// };

// const data = {
//   prompt: prompt,
//   max_tokens: 600,
//   temperature: 0.7,
//   presence_penalty: 0.3,
//   stop: [`\n`],
//   format: `text`,
// };

// Send the POST request using Axios
// axios
//   .post(apiUrl, data, { headers })
//   .then((response) => {
//     // Handle the response from ChatGPT
//     const completion = response.data.choices[0].text;
//     console.log(`ChatGPT response:`, completion);
//   })
//   .catch((error) => {
//     // Handle any errors that occur
//     console.error(`Error:`, error);
//   });

// Introduction (Historical Context) - 21 tokens
// Tone (Casual) - 6 tokens
// Narrative (Suspense) - 7 tokens
// Hyperbole - 3 tokens
// Metaphor - 3 tokens
// Simile - 3 tokens
// Product Details (including labels and IDs) - 124 tokens
// Images (including labels and IDs) - 30 tokens

// Total minimum tokens for all requirements = 21 + 6 + 7 + 3 + 3 + 3 + 124 + 30 = 197 tokens

// Note: The minimum number of tokens required is calculated by taking the shortest possible phrases or descriptions for each requirement, while still fulfilling the specified stylistic requirements. In practice, a well-developed narrative may use more tokens to provide a more engaging and complete story.

generalFormat: (queryResults) => {
  const prompt = {
    "Product Name": "Product Name: " + queryResults.title,
    "Product Overview": "Product Overview: " + queryResults.description,
    "Target Audience": "Target Audience: " + queryResults.targetAudience,
    "Key Features": "Key Features: " + queryResults.keyFeatures,
    "Technical Specifications":
      "Technical Specifications: " + queryResults.technicalSpecifications,
    "Use Cases": "Use Cases: " + queryResults.useCases,
    "Integration Points":
      "Integration Points: " + queryResults.integrationPoints,
    "Implementation Details":
      "Implementation Details: " + queryResults.implementationDetails,
    "Support and Maintenance":
      "Support and Maintenance: " + queryResults.supportAndMaintenance,
    "Known Issues and Limitations":
      "Known Issues and Limitations: " + queryResults.knownIssuesAndLimitations,
    "Resources and Documentation":
      "Resources and Documentation: " + queryResults.resourcesAndDocumentation,
  };
};

function generateLanguageRequirementsList(language) {
  const requirementsDict = {
    formats: {},
    introduction: {
      none: {
        prompt: "Introduce the product.",
        tokens: 5,
      },
      overview: {
        prompt:
          "Provide an overview or background information about the product.",
        tokens: 15,
      },
      problemStatement: {
        prompt: "Highlight a problem or need that the product addresses.",
        tokens: 15,
      },
      valueProposition: {
        prompt: "Explain the unique value proposition of the product.",
        tokens: 15,
      },
      historicalContext: {
        prompt:
          "Discuss the historical significance or evolution of the product.",
        tokens: 21,
      },
      targetAudience: {
        prompt:
          "Identify the target audience of the product, and their specific needs or preferences.",
        tokens: 15,
      },
      captivatingStory: {
        prompt: "Share a captivating story or anecdote related to the product.",
        tokens: 40,
      },
      statistics: {
        prompt:
          "Present relevant statistics or data that highlight the importance of the product.",
        tokens: 20,
      },
    },
    tone: {
      none: {
        prompt:
          "Choose a general tone for the product's communication, ensuring that it conveys a balanced and appropriate tone for the target audience.",
        tokens: 5,
      },
      formal: {
        prompt:
          "Select a formal tone for the product's communication, focusing on professionalism and precision to establish credibility and authority.",
        tokens: 8,
      },
      informal: {
        prompt:
          "Choose an informal tone for the product's communication, aiming for a relaxed and conversational style that resonates with the target audience.",
        tokens: 12,
      },
      professional: {
        prompt:
          "Select a professional tone for the product's communication, emphasizing expertise, trustworthiness, and a polished manner of expression.",
        tokens: 12,
      },
      casual: {
        prompt:
          "Choose a casual tone for the product's communication, creating a friendly and approachable atmosphere that makes users feel comfortable and at ease.",
        tokens: 6,
      },
      friendly: {
        prompt:
          "Select a friendly tone for the product's communication, emphasizing warmth, empathy, and a welcoming attitude towards users.",
        tokens: 10,
      },
      authoritative: {
        prompt:
          "Choose an authoritative tone for the product's communication, projecting confidence, expertise, and a commanding presence to establish the product's credibility and influence.",
        tokens: 13,
      },
      persuasive: {
        prompt:
          "Select a persuasive tone for the product's communication, using compelling language, logical arguments, and emotional appeals to convince and influence users.",
        tokens: 12,
      },
      assertive: {
        prompt:
          "Choose an assertive tone for the product's communication, expressing confidence, determination, and a strong sense of purpose to leave a lasting impact on users.",
        tokens: 11,
      },
      serious: {
        prompt:
          "Select a serious tone for the product's communication, focusing on conveying gravity, importance, and a no-nonsense approach to address critical matters effectively.",
        tokens: 11,
      },
      playful: {
        prompt:
          "Choose a playful tone for the product's communication, infusing humor, wit, and lightheartedness to create an enjoyable and entertaining user experience.",
        tokens: 12,
      },
      humorous: {
        prompt:
          "Select a humorous tone for the product's communication, aiming to entertain and evoke laughter while effectively conveying the intended message or information.",
        tokens: 10,
      },
      empathetic: {
        prompt:
          "Choose an empathetic tone for the product's communication, demonstrating understanding, compassion, and sensitivity towards users' needs, concerns, or challenges.",
        tokens: 13,
      },
      compassionate: {
        prompt:
          "Select a compassionate tone for the product's communication, showing genuine care, kindness, and a willingness to help users overcome their difficulties or obstacles.",
        tokens: 14,
      },
      confident: {
        prompt:
          "Choose a confident tone for the product's communication, projecting self-assurance, belief in the product's value, and inspiring trust in users.",
        tokens: 11,
      },
      conversational: {
        prompt:
          "Select a conversational tone for the product's communication, using a natural and engaging language style that resembles a friendly conversation with users.",
        tokens: 14,
      },
      inspirational: {
        prompt:
          "Choose an inspirational tone for the product's communication, aiming to motivate, uplift, and instill a sense of purpose or aspiration in users.",
        tokens: 15,
      },
      educational: {
        prompt:
          "Select an educational tone for the product's communication, focusing on informative and instructional content to impart knowledge and help users learn.",
        tokens: 13,
      },
      motivational: {
        prompt:
          "Choose a motivational tone for the product's communication, using encouraging language, positive reinforcement, and inspiring messages to drive users towards their goals.",
        tokens: 13,
      },
      engaging: {
        prompt:
          "Select an engaging tone for the product's communication, aiming to captivate users' attention, stimulate their interest, and maintain their active involvement.",
        tokens: 12,
      },
      energetic: {
        prompt:
          "Choose an energetic tone for the product's communication, conveying enthusiasm, vigor, and a dynamic spirit to create a sense of excitement and vitality.",
        tokens: 12,
      },
      soothing: {
        prompt:
          "Select a soothing tone for the product's communication, focusing on providing a calming and comforting experience that alleviates stress or anxiety for users.",
        tokens: 13,
      },
      direct: {
        prompt:
          "Choose a direct tone for the product's communication, using concise and straightforward language to convey information or instructions efficiently.",
        tokens: 10,
      },
      concise: {
        prompt:
          "Select a concise tone for the product's communication, aiming for brevity, clarity, and the effective conveyance of information with minimal verbosity.",
        tokens: 11,
      },
      warm: {
        prompt:
          "Choose a warm tone for the product's communication, emphasizing a friendly, inviting, and affectionate approach to create a positive emotional connection with users.",
        tokens: 9,
      },
    },
    focus: {
      design: {
        prompt: "Highlight the innovative and appealing design features.",
        tokens: 9,
      },
      functionality: {
        prompt:
          "Emphasize the practical and functional aspects of the product or idea.",
        tokens: 12,
      },
      customization: {
        prompt:
          "Discuss the customization options or personalization features available.",
        tokens: 12,
      },
      technology: {
        prompt:
          "Explain the acacia technology or cutting-edge features utilized.",
        tokens: 12,
      },
      versatility: {
        prompt:
          "Highlight the versatility and adaptability of the product or service.",
        tokens: 10,
      },
      userExperience: {
        prompt:
          "Focus on the seamless user experience and intuitive interface.",
        tokens: 10,
      },
      sustainability: {
        prompt:
          "Highlight the environmentally-friendly and sustainable features.",
        tokens: 10,
      },
      durability: {
        prompt:
          "Emphasize the durability and long-lasting quality of the product or service.",
        tokens: 11,
      },
    },
    evocative: {
      vividDescriptions: {
        prompt:
          "Incorporate vivid and sensory descriptions to bring the product or idea to life.",
        tokens: 12,
      },
      figurativeLanguage: {
        prompt:
          "Use similes, metaphors, or other figures of speech to create evocative descriptions.",
        tokens: 15,
      },
      storytelling: {
        prompt:
          "Employ storytelling techniques to engage readers and evoke emotions.",
        tokens: 10,
      },
      imagery: {
        prompt:
          "Use descriptive imagery to paint a clear mental picture in the reader's mind.",
        tokens: 10,
      },
      sensoryDetails: {
        prompt:
          "Incorporate sensory details that appeal to sight, sound, touch, taste, and smell.",
        tokens: 12,
      },
      poeticLanguage: {
        prompt:
          "Infuse poetic language and lyrical prose to add beauty and elegance to the descriptions.",
        tokens: 14,
      },
      atmosphere: {
        prompt:
          "Create an atmosphere or mood through descriptive language to set the tone of the article.",
        tokens: 12,
      },
      comparisons: {
        prompt:
          "Make effective comparisons to familiar objects or experiences to enhance understanding.",
        tokens: 10,
      },
    },

    narrative: {
      foreshadowing: {
        prompt:
          "Highlight how the product's features and functionality foreshadow future events or outcomes, providing users with a sense of anticipation and excitement.",
        tokens: 20,
      },
      flashback: {
        prompt:
          "Focus on the product's ability to interrupt the usual sequence of operations, allowing users to revisit and explore past events or memories effortlessly.",
        tokens: 17,
      },
      suspense: {
        prompt:
          "Interpret how the product builds tension and keeps users engaged and curious about the outcome, creating an immersive and thrilling experience.",
        tokens: 7,
      },
      symbolism: {
        prompt:
          "Highlight how the product utilizes symbolic representations through objects, characters, or actions, adding deeper meaning and resonating with users on a profound level.",
        tokens: 20,
      },
      irony: {
        prompt:
          "Interpret how the product presents unexpected outcomes or contrasts, providing users with a delightful and surprising experience that challenges their expectations.",
        tokens: 18,
      },
      metaphor: {
        prompt:
          "Focus on how the product makes vivid and imaginative comparisons between unrelated elements, enabling users to understand complex concepts or ideas more intuitively.",
        tokens: 18,
      },
      simile: {
        prompt:
          "Highlight the product's use of similes to describe its features or functionality in a relatable and understandable way, making it easy for users to grasp its value.",
        tokens: 18,
      },
      allusion: {
        prompt:
          "Interpret how the product references well-known people, events, or works of literature, evoking certain emotions or associations that resonate with users.",
        tokens: 17,
      },
      allegory: {
        prompt:
          "Focus on how the product uses a narrative or story to represent abstract ideas or moral principles, allowing users to engage with deeper meanings and messages.",
        tokens: 17,
      },
      juxtaposition: {
        prompt:
          "Highlight how the product juxtaposes contrasting elements or ideas, emphasizing their differences and creating a sense of tension that captivates users.",
        tokens: 17,
      },
      imagery: {
        prompt:
          "Focus on how the product uses vivid and descriptive language to create mental images and sensory experiences for users, immersing them in a rich and captivating environment.",
        tokens: 20,
      },
      dialogue: {
        prompt:
          "Interpret how the product incorporates meaningful conversations between users or characters, revealing their thoughts, emotions, and relationships, and enhancing the overall user experience.",
        tokens: 20,
      },
      point_of_view: {
        prompt:
          "Highlight the product's unique narrative perspective or point of view, whether it's first-person, third-person limited, or third-person omniscient, providing users with a distinct and engaging storytelling experience.",
        tokens: 23,
      },
      cliffhanger: {
        prompt:
          "Focus on how the product ends each stage or phase with suspenseful or unresolved situations, leaving users wanting more and eager to continue their journey.",
        tokens: 20,
      },
      character_development: {
        prompt:
          "Interpret how the product allows for the progression and growth of characters or user profiles, including their thoughts, actions, and relationships, providing a dynamic and immersive user experience.",
        tokens: 25,
      },
      plot_twist: {
        prompt:
          "Highlight the product's ability to introduce unexpected or surprising changes in the storyline or user journey, challenging users' expectations and keeping them engaged and intrigued.",
        tokens: 20,
      },
      narrative_voice: {
        prompt:
          "Interpret how the product's narrative voice, whether it's from the narrator or the main character, creates a unique style, tone, and personality, enhancing the overall user experience and immersing users in the story.",
        tokens: 22,
      },
      setting: {
        prompt:
          "Highlight how the product's time, place, and environment contribute to the overall mood and atmosphere, creating an immersive and engaging experience for users.",
        tokens: 18,
      },
      motif: {
        prompt:
          "Interpret how the product incorporates recurring elements, images, or themes that hold symbolic significance throughout the user journey, providing users with a cohesive and meaningful experience.",
        tokens: 20,
      },
      prologue_epilogue: {
        prompt:
          "Focus on how the product incorporates an introductory or concluding section, such as a prologue or epilogue, providing users with additional context or insight into the product story and enhancing their overall understanding and engagement.",
        tokens: 23,
      },
    },
    rhetorical: {
      anaphora: {
        prompt:
          "Use the repetition of the same word or phrase at the beginning of successive clauses or sentences to emphasize key points or concepts, creating a powerful and memorable impact.",
        tokens: 23,
      },
      chiasmus: {
        prompt:
          "Use a reversal in the order of words or phrases in successive clauses to create a contrasting effect, capturing users' attention and making a lasting impression.",
        tokens: 18,
      },
      hyperbole: {
        prompt:
          "Convey emphasis and dramatic effect through the use of exaggerated statements, showcasing its unique features and benefits in an attention-grabbing and memorable way.",
        tokens: 3,
      },
      metaphor: {
        prompt:
          "Employs metaphors to create vivid images and convey deeper meanings, enabling users to relate to and understand its value proposition on a deeper level.",
        tokens: 3,
      },
      simile: {
        prompt:
          "Use similes to highlight similarities between two different things, making its benefits more relatable and easily understandable for users.",
        tokens: 3,
      },
      alliteration: {
        prompt:
          "Use alliteration, which involves the repetition of the same sound or letter at the beginning of closely connected words, creating a rhythmic and memorable effect that captures users' attention.",
        tokens: 17,
      },
      antithesis: {
        prompt:
          "Use antithesis, where contrasting ideas or words are juxtaposed to create a balanced and contrasting effect.",
        tokens: 14,
      },
      "rhetorical question": {
        prompt:
          "Use rhetorical questions to engage users and make thought-provoking points, stimulating their thinking and prompting them to consider the product's benefits and advantages.",
        tokens: 17,
      },
      irony: {
        prompt:
          "Use irony, where words are used to convey a meaning opposite to their literal interpretation, creating a sense of intrigue and making users reflect on the product's underlying message or value.",
        tokens: 18,
      },
      personification: {
        prompt:
          "Use personification, attributing human qualities or characteristics to non-human entities or abstract concepts, making the product more relatable and fostering an emotional connection with users.",
        tokens: 21,
      },
      metonymy: {
        prompt:
          "Use metonymy, where a related word or phrase is used to represent something else based on association or proximity, making it easier for users to understand and remember key aspects of the product.",
        tokens: 22,
      },
      onomatopoeia: {
        prompt:
          "Incorporates onomatopoeia, using words that imitate the sounds they represent, creating a sensory experience and making the product more engaging and memorable for users.",
        tokens: 21,
      },
      polysyndeton: {
        prompt:
          "Use polysyndeton, the repetition of conjunctions (e.g., 'and', 'or') in close succession, creating a rhythmic and impactful effect that draws users' attention and emphasizes key features or benefits.",
        tokens: 24,
      },
      asyndeton: {
        prompt:
          "Use asyndeton, the omission of conjunctions between words or phrases, creating a concise or rapid effect that highlights the product's efficiency, simplicity, or speed.",
        tokens: 19,
      },
      epistrophe: {
        prompt:
          "Use the repetition of the same word or phrase at the end of successive clauses or sentences to emphasize key points or concepts, leaving a lasting impression on users and reinforcing the product's message.",
        tokens: 23,
      },
    },
    engagingFormats: {
      textWithVisuals: {
        prompt:
          "Create a series of brief slides with concise text to tell a story or convey a message. Enhance each slide using imagery, animations, or graphics.",
      },
      quotesMessages: {
        prompt:
          "Share inspirational quotes, motivating messages, or thought-provoking statements. Divide them into multiple slides to emphasize and leave an impact.",
      },
      howToTips: {
        prompt:
          "Provide quick tips, life hacks, or step-by-step instructions. Split the content across multiple slides, highlighting each tip or step.",
      },
      factsStatistics: {
        prompt:
          "Present intriguing facts, statistics, or trivia with visual appeal. Unveil each piece of information one by one across different slides.",
      },
      storytelling: {
        prompt:
          "Engage viewers with short, captivating stories. Use cliffhangers to encourage swiping for the next part of the story.",
      },
      questionAnswer: {
        prompt:
          "Ask a question on one slide and offer the answer on the next. Encourage audience engagement and interaction.",
      },
      beforeAfter: {
        prompt:
          "Showcase transformations, makeovers, or progress using a before-and-after approach. Each slide reveals a different stage of change.",
      },
      listsRankings: {
        prompt:
          "Create lists or rankings of items, ideas, or preferences. Number the slides to guide viewers through the list.",
      },
      miniBlogInsights: {
        prompt:
          "Share bite-sized insights, mini-blog posts, or reflections. Split the content into several slides for a series of concise thoughts.",
      },
      wordplayPuns: {
        prompt:
          "Craft clever wordplay, puns, or jokes that unfold across multiple slides. Entertain and engage your audience with humor.",
      },
      fictionalStories: {
        prompt:
          "Write brief fictional stories or scenarios that span across slides. Keep viewers engaged by revealing the plot gradually.",
      },
      educationalNuggets: {
        prompt:
          "Share interesting facts, history, or cultural insights in small, digestible portions across multiple slides.",
      },
    },
    socialMedia: {
      none: {
        prompt:
          "Choose a target audience that encompasses a general demographic without specific platform preferences.",
        tokens: 18,
      },
      facebook: {
        prompt:
          "Select the target audience for Facebook, focusing on users who engage with content and interactions on this platform.",
        tokens: 21,
      },
      twitter: {
        prompt:
          "Choose the target audience for Twitter, focusing on users who actively participate in discussions and trends on this platform.",
        tokens: 20,
      },
      instagram: {
        prompt:
          "Select the target audience for Instagram, focusing on users who engage with visual content and social interactions on this platform.",
        tokens: 21,
      },
      linkedin: {
        prompt:
          "Choose the target audience for LinkedIn, focusing on professionals and businesses who utilize this platform for networking and career-related purposes.",
        tokens: 24,
      },
      pinterest: {
        prompt:
          "Select the target audience for Pinterest, focusing on users who actively search for and engage with visual content related to various interests and hobbies.",
        tokens: 23,
      },
      snapchat: {
        prompt:
          "Choose the target audience for Snapchat, focusing on users who prefer ephemeral and interactive content experiences on this platform.",
        tokens: 21,
      },

      youtube: {
        prompt:
          "Choose the target audience for YouTube, focusing on users who consume and engage with video content across various topics and genres on this platform.",
        tokens: 24,
      },
      reddit: {
        prompt:
          "Select the target audience for Reddit, focusing on users who actively participate in communities and discussions on this platform.",
        tokens: 20,
      },
      tumblr: {
        prompt:
          "Choose the target audience for Tumblr, focusing on users who enjoy creative expression, multimedia content, and niche interests on this platform.",
        tokens: 22,
      },
    },
    venues: {
      podcast: {
        prompt:
          "Select the target audience for your podcast, focusing on listeners who are interested in the content and topics related to your product.",
      },
      newsletter: {
        prompt:
          "Choose the target audience for your newsletter, focusing on subscribers who are interested in receiving updates, news, and valuable information about your product or industry.",
      },
      forum: {
        prompt:
          "Select the target audience for your forum, focusing on users who actively participate in discussions and seek information or support related to your product or niche.",
      },
      blog: {
        prompt:
          "Choose the target audience for your blog, focusing on readers who are interested in the topics, insights, and resources that revolve around your product or industry.",
      },
      eCommerce: {
        prompt:
          "Select the target audience for your eCommerce platform, focusing on potential customers who are interested in purchasing products or services similar to what your platform offers.",
      },
      event: {
        prompt:
          "Choose the target audience for your event, focusing on individuals who are likely to attend and engage with the activities, presentations, or workshops that showcase your product or industry.",
      },
      students: {
        prompt:
          "Select the target audience for educational content or resources related to your product, focusing on learners who are studying or interested in the specific subject or field that your product relates to.",
      },
    },
    liveEvents: {
      podcast: {
        prompt:
          "Select the target audience for your podcast, focusing on listeners who are interested in the content and topics related to your product.",
      },
      newsletter: {
        prompt:
          "Choose the target audience for your newsletter, focusing on subscribers who are interested in receiving updates, news, and valuable information about your product or industry.",
      },
      forum: {
        prompt:
          "Select the target audience for your forum, focusing on users who actively participate in discussions and seek information or support related to your product or niche.",
      },
      blog: {
        prompt:
          "Choose the target audience for your blog, focusing on readers who are interested in the topics, insights, and resources that revolve around your product or industry.",
      },
      eCommerce: {
        prompt:
          "Select the target audience for your eCommerce platform, focusing on potential customers who are interested in purchasing products or services similar to what your platform offers.",
      },
      event: {
        prompt:
          "Choose the target audience for your event, focusing on individuals who are likely to attend and engage with the activities, presentations, or workshops that showcase your product or industry.",
      },
      students: {
        prompt:
          "Select the target audience for educational content or resources related to your product, focusing on learners who are studying or interested in the specific subject or field that your product relates to.",
      },
    },
    academicFormats: {
      researchPapers: {
        definition:
          "Academic research papers present original research findings, methodologies, and analysis on a specific topic.",
        prompt:
          "Please provide a research paper that presents original research findings, methodologies, and analysis on a specific topic.",
        tokens: 28,
      },
      reviewArticles: {
        definition:
          "Review articles provide a comprehensive overview and analysis of existing research and literature on a particular topic.",
        prompt:
          "Please provide a review article that offers a comprehensive overview and analysis of existing research and literature on a particular topic.",
        tokens: 31,
      },
      caseStudies: {
        definition:
          "Academic case studies analyze a particular individual, organization, event, or phenomenon in depth.",
        prompt:
          "Please provide an academic case study that analyzes a particular individual, organization, event, or phenomenon in depth.",
        tokens: 26,
      },
      thesesAndDissertations: {
        definition:
          "Theses and dissertations are formal documents submitted by students to fulfill the requirements of an academic degree.",
        prompt:
          "Please provide a thesis or dissertation that meets the formal requirements for an academic degree.",
        tokens: 40,
      },
      conferencePapers: {
        definition:
          "Conference papers are documents prepared for presentation at academic conferences or symposiums.",
        prompt:
          "Please provide a conference paper that has been prepared for presentation at an academic conference or symposium.",
        tokens: 25,
      },
      literatureReviews: {
        definition:
          "Literature reviews summarize and analyze existing research and publications on a particular topic.",
        prompt:
          "Please provide a literature review that summarizes and analyzes existing research and publications on a particular topic.",
        tokens: 27,
      },
      abstracts: {
        definition:
          "Abstracts are concise summaries of a research paper, conference presentation, or article.",
        prompt:
          "Please provide an abstract that serves as a concise summary of a research paper, conference presentation, or article.",
        tokens: 24,
      },
      academicEssays: {
        definition:
          "Academic essays are shorter written compositions that present arguments or analyses on a specific topic.",
        prompt:
          "Please provide an academic essay that presents arguments or analyses on a specific topic.",
        tokens: 21,
      },
    },
  };

  const requirements = [];

  if (language) {
    for (const [key, value] of language) {
      // console.log('key: ' + key + ' value: ' + value)
      const keyLabelRequirements = [key, []];
      for (const valueOption of value) {
        const prompts = keyLabelRequirements[1];
        prompts.push({
          value: valueOption,
          prompt: requirementsDict[key][valueOption]?.prompt,
        });
      }
      requirements.push(keyLabelRequirements);
    }
  }
  // console.log("requirements: ", requirements);
  return requirements;
}

export async function generateReport({
  productData,
  includedFocusPoints,
  languageAndFormattingOptions,
  requestType,
}) {
  // const requirementsList = generateLanguageRequirementsList(
  //   productData,
  //   includedFocusPoints,
  //   languageAndFormattingOptions
  // );

  const prompt = generateLanguageRequirementsList(
    productData,
    includedFocusPoints,
    languageAndFormattingOptions
  );

  return prompt;
}

const colors =  colorPalette; //|| generateColorPalette(23);

function toSingular(word) {
  if (!word) {
    "report this error singular:" + Math.random().toString();
  }

  return pluralize.singular(word);
}

const filterKey = (label) => {
  if (!label) {
    "report this error filterKey" + Math.random().toString();
  }
  label = label.replace(/^.*?_/g, "");
  return toSingular(label);
};

const filterElement = (label) => {
  if (!label) {
    "report this error filterElement:" + Math.random().toString();
  }
  label = label.replace(/([a-z])([A-Z])/g, "$1 $2").trim();
  label = label
    .replace(/inventory/g, "")
    .replace(/:/g, "")
    .trim();
  // .toLowerCase();
  return label;
};

const adjustedLabels = (label, key, numb) => {
  label = label === "none" ? `stand ${key} ${numb}` : filterElement(label);
  return label;
};

function generatePrompt(productData, details, requirements) {
  let colorIndex = 0;

  const getColor = () => {
    const color = colors[colorIndex++];
    return { color, id: color };
  };

  const exampleDetails = [];
  const exampleStyles = [];
  const legend = [];
  const lines = [];

  const addLine = (text) => lines.push(text);
  const addLineFront = (text) => lines.unshift(text);
  const addHeading = (heading) => addLine(`\n${heading}`);
  const addQuotes = (text) => (text.length ? `"${text}"` : "");

  const addProductDescription = (exampleDetails, exampleStyles) => {
    const exampleDetailsStr = exampleDetails
      .slice(-1) // rewrite split slice join logic;
      .map(
        ([key, value]) =>
          `(${key.trim().split(" ").slice(1).join(" ")} - ${value})`
      )
      .join(", ");

    const exampleStylesStr = exampleStyles
      .slice(-1)
      .map(([key, value]) => `(${key.trim()} - ${value})`)
      .join(",  ");
    const title = productData.title.replace(/\n/g, "");
    addLineFront(
      `Compose a narrative that introduces the ${title} and creatively incorporates the following product details using the narrative stylistic requirements below. In this document are unique identifiers; they look like this ${addQuotes(
        exampleDetailsStr
      )}. These are all requirements. Reference them in the composition as label notes below the passage; where you fulfill the requirement. Examples: ${addQuotes(
        exampleStylesStr
      )}  ${addQuotes(exampleDetailsStr)}`
    );
    addLineFront(`Product Name: ${title}`);
  };

  const addSectionDetails = (section, heading) => {
    details.forEach(([key, value]) => {
      if (section !== key) {
        return;
      }
      // console.log(section, value);
      addHeading(heading);

      value.forEach((element, index) => {
        if (!element) {
          return;
        }
        const { color, id } = getColor();
        let line;

        if (key === "collections") {
          legend.push([element.title, color]);
          exampleDetails.push([element.title, id]);
          line = `\n\t${index + 1}. (${element.title} - ${id}).`;
        } else if (key === "images") {
          legend.push([element, color]);
          exampleDetails.push([element, id]);
          // console.log("element---->", element);
          line = `\n\t${index + 1}. ${element}\n\t(${element} - ${id})\n`;
        } else if (key === "description") {
          exampleDetails.push(["description", id]);
          line = `\n\t${index + 1}. ${element}\n\tdescription : ${id}.`;
        } else {
          legend.push([element, color]);
          exampleDetails.push([element, id]);
          line = `\n\t${index + 1}. ${element}: ${id}.`;
        }

        addLine(line);
      });
    });
    // addLine("\n");
  };

  const addOtherDetails = () => {
    const other = details.filter(
      (headings) =>
        !["collections", "images", "description"].includes(headings[0])
    );
    other.forEach(([key, elements]) => {
      if (key.includes("variant")) {
        let focus = `${key.replace(/[_]/g, ": ")}`;

        const { color, id } = getColor();
        legend.push([focus.slice(), color]);
        focus = `Creatively incorporate the variant: "${focus
          .replace(/variant:/g, "")
          .trim()}" options in the composition using the stylistic requirements below:`;

        addLine(`${focus}\n`);
        elements.forEach((element, index) => {
          if (element.includes("title")) return;
          const { color, id } = getColor();

          legend.push([element, color]);
          exampleDetails.push([
            `\t${filterKey(key)} ${filterElement(element)}`,
            color,
          ]);
          addLine(
            `\t${index + 1}. (${filterElement(element)} - ${id}).\n`
          );
        });
        return;
      }
      if (key.includes("option")) {
        let focus = `${key.replace(/[_]/g, ": ")}`;
        const { color, id } = getColor();
        legend.push([focus.slice(), color]);
        focus = `Creatively incorporate these selectable ${pluralize(
          focus.replace(/(\w+)\s*:\s*(\w+)/g, "$2")
        )} in the composition:`;

        addLine(`${focus}\n`);
        elements.forEach((element, index) => {
          if (element.includes("title")) return;
          const { color, id } = getColor();

          legend.push([element, color]);
          exampleDetails.push([
            `${filterKey(key)} ${filterElement(element)}`,
            color,
          ]);
          addLine(
            `\t${index + 1}. (${filterElement(element)} - ${id}).\n`
          );
        });
      } else if (key.includes("tags")) {
        let focus = `${key.replace(/[_]/g, ": ")}`;
        // console.log("tags", focus);
        focus = `Creatively incorporate these tags in the composition using the stylistic requirements below:`;

        addLine(`${focus}\n`);
        elements.forEach((element, index) => {
          if (element.includes("title")) return;
          const { color, id } = getColor();

          legend.push([element, color]);
          exampleDetails.push([
            `\t${filterKey(key)} ${filterElement(element)}`,
            color,
          ]);
          addLine(
            `\t${index + 1}. (${filterElement(element)} - ${id}).\n`
          );
        });
      }
    });
  };

  const addNarrativeRequirements = () => {
    addHeading(
      `Compose a narrative with these narrative stylistic requirements.\n`
    );
    requirements.forEach(([key, narrativeStyles], index) => {
      if (key === "rhetorical") {
        addLine(
          `Requirement ${
              index + 1
            } Skillfully employ these ${key} techniques in the composition using the product details above.`
        );
      } else {
        addLine(`Requirement ${index + 1} ${key}\n`);
      }

      narrativeStyles.forEach((narrativeStyle, i, arrayStyles) => {
        const { color, id } = getColor();
        legend.push([narrativeStyle.value, color]);
        exampleStyles.push([
          adjustedLabels(narrativeStyle.value, key, i + 1),
          color,
        ]);
        addLine(
          `\t${key === "rhetorical" ? "" : narrativeStyle.prompt}\n\t${
            arrayStyles.length > 1 ? `${i + 1} ` : ""
          }(${adjustedLabels(narrativeStyle.value, key, i + 1)} - ${id})\n`
        );
      });
    });
  };

  const addFinalSection = () => {
    const exampleDetailsStr = exampleDetails
      .slice(0, 1)
      .map(([key, value]) => `(${key} - ${value})`)
      .join(" or ");

    const exampleStylesStr = exampleStyles
      .slice(0, 1)
      .map(([key, value]) => `(${key} - ${value})`)
      .join(" or ");

    addLine(
      `\nUse a single round bracket tags for every label and id to reference the requirements in the composition. Tag examples: ${addQuotes(
        exampleDetailsStr
      )}  ${addQuotes(exampleStylesStr)}`
    );
  };

  addSectionDetails(
    "collections",
    "Mention these collections in the composition, using the narrative stylistic requirements listed below:"
  );
  addSectionDetails(
    "description",
    "Use this description to hone your composition:"
  );
  addSectionDetails(
    "images",
    "Provide a visual context for the product in the composition by cleverly placing and calling attention to the image URL in the composition. Reference them with the labeled id beneath each URL in the composition:"
  );
  addOtherDetails();
  addNarrativeRequirements();
  addFinalSection();
  // Main Execution Flow
  addProductDescription(exampleDetails, exampleStyles);
  const prompt = lines.join("\n");
  return { prompt, legend, documentType: "text" };
}

export function withoutOptions(productData) {
  const language = [
    ["introduction", ["none"]],
    ["tone", ["none"]],
  ];

  const focus = [];

  const requirementsList = generateLanguageRequirementsList(language);

  return generatePrompt(productData, focus, requirementsList);
}

export function withLanguageOption(productData, language) {
  const focus = [];
  const requirementsList = generateLanguageRequirementsList(language);

  return generatePrompt(productData, focus, requirementsList);
}

export function withProductDetails(productData, focus) {
  const language = [
    ["introduction", ["none"]],
    ["tone", ["none"]],
  ];

  const requirementsList = generateLanguageRequirementsList(language);

  return generatePrompt(productData, focus, requirementsList);
}

export function withLanguageAndProductOption(productData, language, focus) {
  const requirementsList = generateLanguageRequirementsList(language);

  return generatePrompt(productData, focus, requirementsList);
}
