const ChinesFigureOfSpeech = {
  categories: [
    {
      category: "Figures of speech",
      devices: [
        {
          name: "Metaphor",
          chineseName: "比喻",
          phonetic: "Bǐyù",
          definition: {
            english:
              "A figure of speech that involves making a comparison between two unrelated things.",
            chinese: "一种修辞手法，通过将两个不相关的事物进行比较来表达意义。",
          },
        },
        {
          name: "Hyperbole",
          chineseName: "夸张",
          phonetic: "Kuāzhāng",
          definition: {
            english:
              "Exaggerated statements or claims used for emphasis or dramatic effect.",
            chinese: "夸大的陈述或言论，用于强调或产生戏剧效果。",
          },
        },
        {
          name: "Irony",
          chineseName: "反讽",
          phonetic: "Fǎnfǔ",
          definition: {
            english:
              "A rhetorical device in which the intended meaning is opposite to the literal meaning.",
            chinese: "修辞手法，意义与字面意义相反。",
          },
        },
        {
          name: "Personification",
          chineseName: "拟人",
          phonetic: "Nǐrén",
          definition: {
            english:
              "Attributing human qualities or characteristics to non-human entities.",
            chinese: "将非人类实体赋予人类的特质或特征。",
          },
        },
      ],
    },
    {
      category: "Parallelism",
      devices: [
        {
          name: "Antithesis",
          chineseName: "对偶",
          phonetic: "Duìǒu",
          definition: {
            english:
              "Juxtaposing contrasting ideas or words to create a balanced and rhythmic effect.",
            chinese: "将对立的观点或词语并列放置，以产生平衡和节奏感。",
          },
        },
        {
          name: "Parallelism",
          chineseName: "排比",
          phonetic: "Páibǐ",
          definition: {
            english:
              "Repeating similar grammatical structures or patterns for emphasis or rhetorical effect.",
            chinese: "通过重复类似的语法结构或模式来强调或产生修辞效果。",
          },
        },
        {
          name: "Repetition",
          chineseName: "重复",
          phonetic: "Chóngfù",
          definition: {
            english:
              "The act of repeating words or phrases for emphasis or to create a memorable impact.",
            chinese: "重复使用单词或短语以强调或产生记忆效果。",
          },
        },
      ],
    },
    {
      category: "Analogy",
      devices: [
        {
          name: "Simile",
          chineseName: "明喻",
          phonetic: "Míngyù",
          definition: {
            english:
              "A figure of speech that directly compares two things using 'like' or 'as'.",
            chinese: "一种修辞手法，通过使用“像”或“如同”来直接比较两个事物。",
          },
        },
        {
          name: "Analogy",
          chineseName: "比拟",
          phonetic: "Bǐnǐ",
          definition: {
            english:
              "Drawing a comparison between two different things to illustrate a similarity.",
            chinese: "通过比较两个不同的事物来说明相似之处。",
          },
        },
      ],
    },
    {
      category: "Rhetorical questions",
      devices: [
        {
          name: "Rhetorical questions",
          chineseName: "反问",
          phonetic: "Fǎnwèn",
          definition: {
            english:
              "A question asked to make a point or to create an effect rather than to elicit an answer.",
            chinese: "一种用于强调观点或产生效果而非寻求答案的问句。",
          },
        },
        {
          name: "Rhetorical exclamations",
          chineseName: "反感叹",
          phonetic: "Fǎngǎntàn",
          definition: {
            english:
              "Expressions of strong feelings or emotions used for rhetorical impact.",
            chinese: "通过表达强烈的感情或情绪来产生修辞效果。",
          },
        },
      ],
    },
    {
      category: "Rhetorical techniques",
      devices: [
        {
          name: "Repetition",
          chineseName: "重复",
          phonetic: "Chóngfù",
          definition: {
            english:
              "The act of repeating words or phrases for emphasis or to create a memorable impact.",
            chinese: "重复使用单词或短语以强调或产生记忆效果。",
          },
        },
        {
          name: "Allusion",
          chineseName: "典故",
          phonetic: "Diǎngù",
          definition: {
            english:
              "A reference to a person, place, event, or work of literature that enhances meaning or understanding.",
            chinese: "对人物、地点、事件或文学作品的引用，以增强意义或理解。",
          },
        },
        {
          name: "Euphemism",
          chineseName: "委婉语",
          phonetic: "Wěiwǎn yǔ",
          definition: {
            english:
              "The use of mild or indirect words or phrases to substitute for something unpleasant or offensive.",
            chinese: "使用温和或间接的词语来代替令人不快或冒犯的事物。",
          },
        },
        {
          name: "Understatement",
          chineseName: "轻描淡写",
          phonetic: "Qīngmiáodànxiě",
          definition: {
            english:
              "The deliberate downplaying or minimizing of the significance or importance of something.",
            chinese: "有意淡化或减小某事物的重要性或意义。",
          },
        },
      ],
    },
  ],
};
export const audienceModel = {
  pageTitle: "Audience",
  sections: [
    {
      sectionTitle: "Target Audience",
      IonItems: [
        {
          IonElement: "IonSelect",
          label: "Select Language",
          placeholder: "Select",
          category: "language",
          default: "english",
          multiple: false,
          values: {
            tag: "ion-select-option",
            options: [
              { value: "english", title: "English" },
              { value: "spanish", title: "Spanish" },
              { value: "french", title: "French" },
              { value: "german", title: "German" },
              { value: "italian", title: "Italian" },
              { value: "portuguese", title: "Portuguese" },
              { value: "chinese", title: "Chinese" },
              { value: "japanese", title: "Japanese" },
              { value: "korean", title: "Korean" },
              { value: "russian", title: "Russian" },
              { value: "arabic", title: "Arabic" },
              { value: "hindi", title: "Hindi" },
              { value: "bengali", title: "Bengali" },
              { value: "urdu", title: "Urdu" },
              { value: "swahili", title: "Swahili" },
              { value: "dutch", title: "Dutch" },
              { value: "turkish", title: "Turkish" },
              { value: "greek", title: "Greek" },
              { value: "polish", title: "Polish" },
              { value: "swedish", title: "Swedish" },
            ],
          },
        },
        {
          IonElement: "IonSelect",
          label: "Select a Tone",
          placeholder: "Select",
          category: "tone",
          default: "none",
          multiple: false,
          values: {
            tag: "ion-select-option",
            options: [
              { value: "none", title: "General Tone" },
              { value: "formal", title: "Formal" },
              { value: "informal", title: "Informal" },
              { value: "professional", title: "Professional" },
              { value: "casual", title: "Casual" },
              { value: "friendly", title: "Friendly" },
              { value: "authoritative", title: "Authoritative" },
              { value: "persuasive", title: "Persuasive" },
              { value: "assertive", title: "Assertive" },
              { value: "serious", title: "Serious" },
              { value: "playful", title: "Playful" },
              { value: "humorous", title: "Humorous" },
              { value: "empathetic", title: "Empathetic" },
              { value: "compassionate", title: "Compassionate" },
              { value: "confident", title: "Confident" },
              { value: "conversational", title: "Conversational" },
              { value: "inspirational", title: "Inspirational" },
              { value: "educational", title: "Educational" },
              { value: "motivational", title: "Motivational" },
              { value: "engaging", title: "Engaging" },
              { value: "energetic", title: "Energetic" },
              { value: "soothing", title: "Soothing" },
              { value: "authoritative", title: "Authoritative" },
              { value: "direct", title: "Direct" },
              { value: "concise", title: "Concise" },
              { value: "warm", title: "Warm" },
            ],
          },
        },
        {
          IonElement: "IonSelect",
          label: "Introduction: Select a Context",
          placeholder: "Select",
          category: "introduction",
          default: "none",
          multiple: false,
          values: {
            tag: "ion-select-option",
            options: [
              { value: "none", title: "General Intro" },
              { value: "overview", title: "General Overview" },
              { value: "problemStatement", title: "Addresses a Problem" },
              { value: "valueProposition", title: "Unique Value" },
              { value: "historicalContext", title: "Product History" },
              { value: "targetAudience", title: "Audience Needs" },
              { value: "captivatingStory", title: "Captivating Story" },
              { value: "statistics", title: "Relevant Statistics" },
            ],
          },
        },
        {
          IonElement: "IonSelect",
          label: "Feature: Select a Focus for your Product or Idea",
          placeholder: "Select",
          category: "features",
          default: "none",
          multiple: false,
          values: {
            tag: "ion-select-option",
            options: [
              { value: "none", title: "General Focus" },
              { value: "design", title: "Innovative Appeal" },
              { value: "functionality", title: "Practical & Functional" },
              { value: "customization", title: "Customization Options" },
              { value: "technology", title: "Advanced Technology" },
              { value: "versatility", title: "Versatile & Adaptable" },
              { value: "userExperience", title: "Seamless User Experience" },
              { value: "sustainability", title: "Environmentally-Friendly" },
              { value: "durability", title: "Long-Lasting" },
            ],
          },
        },
        {
          IonElement: "IonSelect",
          label: "Evocative Language: Choose a Style",
          placeholder: "Select",
          category: "evocative",
          default: "none",
          multiple: false,
          values: {
            tag: "ion-select-option",
            options: [
              { value: "none", title: "General Language" },
              { value: "vividDescriptions", title: "Vivid Descriptions" },
              { value: "figurativeLanguage", title: "Figurative Language" },
              { value: "storytelling", title: "Engaging Storytelling" },
              { value: "imagery", title: "Descriptive Imagery" },
              { value: "sensoryDetails", title: "Appealing Sensory Details" },
              { value: "poeticLanguage", title: "Poetic Language" },
              { value: "atmosphere", title: "Creating Atmosphere" },
              { value: "comparisons", title: "Effective Comparisons" },
            ],
          },
        },

        {
          IonElement: "IonSelect",
          label:
            "Devices: Select the Narrative Devices you want to Incorporate",
          placeholder: "Select",
          category: "narrative",
          default: "none",
          multiple: false,
          values: {
            tag: "ion-select-option",
            options: [
              {
                value: "none",
                title: "General Narrative",
                definition:
                  "H",
              },
              {
                value: "foreshadowing",
                title: "Foreshadowing",
                definition:
                  "Hinting or suggesting future events or outcomes in a story.",
              },
              {
                value: "flashback",
                title: "Flashback",
                definition:
                  "Interrupting the chronological sequence to describe past events or memories.",
              },
              {
                value: "suspense",
                title: "Suspense",
                definition:
                  "Building tension and anticipation to keep the audience engaged and curious about the outcome.",
              },
              {
                value: "symbolism",
                title: "Symbolism",
                definition:
                  "Using objects, characters, or actions to represent deeper meanings or concepts.",
              },
              {
                value: "irony",
                title: "Irony",
                definition:
                  "Presenting something in a way that contrasts with its actual meaning or outcome.",
              },
              {
                value: "metaphor",
                title: "Metaphor",
                definition:
                  "Making a comparison between two unrelated things to create a vivid image or convey a deeper meaning.",
              },
              {
                value: "simile",
                title: "Simile",
                definition:
                  "Making a comparison using 'like' or 'as' to describe something in a more relatable or understandable way.",
              },
              {
                value: "allusion",
                title: "Allusion",
                definition:
                  "Referencing or mentioning a well-known person, event, or work of literature to evoke certain emotions or associations.",
              },
              {
                value: "allegory",
                title: "Allegory",
                definition:
                  "Using a story or narrative to represent abstract ideas or moral principles.",
              },
              {
                value: "juxtaposition",
                title: "Juxtaposition",
                definition:
                  "Placing two contrasting elements or ideas side by side to highlight their differences or create tension.",
              },
              {
                value: "imagery",
                title: "Imagery",
                definition:
                  "Using vivid and descriptive language to create mental images and sensory experiences for the reader.",
              },
              {
                value: "dialogue",
                title: "Dialogue",
                definition:
                  "Conversation between characters that reveals their thoughts, emotions, and relationships.",
              },
              {
                value: "point_of_view",
                title: "Point of View",
                definition:
                  "The perspective from which the story is narrated, such as first-person, third-person limited, or third-person omniscient.",
              },
              {
                value: "cliffhanger",
                title: "Cliffhanger",
                definition:
                  "Ending a chapter or section of a story with a suspenseful or unresolved situation to keep the reader engaged.",
              },
              {
                value: "character_development",
                title: "Character Development",
                definition:
                  "The progression and growth of characters throughout the story, including their thoughts, actions, and relationships.",
              },
              {
                value: "plot_twist",
                title: "Plot Twist",
                definition:
                  "Unexpected or surprising changes in the storyline that challenge the reader's expectations.",
              },
              {
                value: "narrative_voice",
                title: "Narrative Voice",
                definition:
                  "The unique style, tone, and personality of the narrator or main character.",
              },
              {
                value: "setting",
                title: "Setting",
                definition:
                  "The time, place, and environment in which the story takes place, contributing to the overall mood and atmosphere.",
              },
              {
                value: "motif",
                title: "Motif",
                definition:
                  "A recurring element, image, or theme that holds symbolic significance throughout the narrative.",
              },
              {
                value: "prologue_epilogue",
                title: "Prologue/Epilogue",
                definition:
                  "An introductory or concluding section that provides additional context or insight into the story.",
              },
            ],
          },
        },
        {
          IonElement: "IonSelect",
          label: "Rhetorical Devices: Select the ones you want to include",
          placeholder: "Select One or More (Limit: 4)",
          category: "rhetorical",
          default: [],
          multiple: true,
          values: {
            tag: "ion-select-option",
            options: [
              {
                value: "anaphora",
                title: "Anaphora",
                definition:
                  "Repetition of the same word or phrase at the beginning of successive clauses or sentences for emphasis.",
              },
              {
                value: "chiasmus",
                title: "Chiasmus",
                definition:
                  "A reversal in the order of words or phrases in successive clauses to create a contrasting effect.",
              },
              {
                value: "hyperbole",
                title: "Hyperbole",
                definition: "Exaggeration for emphasis or dramatic effect.",
              },
              {
                value: "metaphor",
                title: "Metaphor",
                definition:
                  "Comparison between two unrelated things to create a vivid image or convey meaning.",
              },
              {
                value: "simile",
                title: "Simile",
                definition:
                  "Comparison using 'like' or 'as' to highlight similarities between two different things.",
              },
              {
                value: "alliteration",
                title: "Alliteration",
                definition:
                  "Repetition of the same sound or letter at the beginning of closely connected words.",
              },
              {
                value: "antithesis",
                title: "Antithesis",
                definition:
                  "Juxtaposition of contrasting ideas or words to create a balanced and contrasting effect.",
              },
              {
                value: "rhetorical question",
                title: "Rhetorical Question",
                definition:
                  "A question asked for effect or to make a point, rather than expecting a direct answer.",
              },
              {
                value: "irony",
                title: "Irony",
                definition:
                  "Use of words to convey a meaning opposite to their literal interpretation.",
              },
              {
                value: "personification",
                title: "Personification",
                definition:
                  "Attribution of human qualities or characteristics to non-human entities or abstract concepts.",
              },
              {
                value: "metonymy",
                title: "Metonymy",
                definition:
                  "Use of a related word or phrase to represent something else, often based on association or proximity.",
              },
              {
                value: "onomatopoeia",
                title: "Onomatopoeia",
                definition:
                  "Use of words that imitate the sound they represent.",
              },
              {
                value: "polysyndeton",
                title: "Polysyndeton",
                definition:
                  "Repetition of conjunctions (e.g., 'and', 'or') in close succession for rhetorical effect.",
              },
              {
                value: "asyndeton",
                title: "Asyndeton",
                definition:
                  "Omission of conjunctions between words or phrases for a concise or rapid effect.",
              },
              {
                value: "epistrophe",
                title: "Epistrophe",
                definition:
                  "Repetition of the same word or phrase at the end of successive clauses or sentences for emphasis.",
              },
            ],
          },
        },
        {
          IonElement: "IonSelect",
          label: "Your Audience: Select your audience",
          placeholder: "Select",
          category: "audience",
          default: "none",
          values: {
            tag: "ion-select-option",
            options: [
              { value: "none", title: "General" },
              { value: "facebook", title: "Facebook Audience" },
              { value: "twitter", title: "Twitter Audience" },
              { value: "instagram", title: "Instagram Audience" },
              { value: "linkedin", title: "LinkedIn Audience" },
              { value: "pinterest", title: "Pinterest Audience" },
              { value: "snapchat", title: "Snapchat Audience" },
              { value: "tiktok", title: "TikTok Audience" },
              { value: "youtube", title: "YouTube Audience" },
              { value: "reddit", title: "Reddit Audience" },
              { value: "tumblr", title: "Tumblr Audience" },
              // Additional audience types
              { value: "podcast", title: "Podcast Audience" },
              { value: "newsletter", title: "Newsletter Audience" },
              { value: "forum", title: "Forum Audience" },
              { value: "blog", title: "Blog Audience" },
              { value: "eCommerce", title: "eCommerce Audience" },
              { value: "event", title: "Event Attendees" },
              { value: "students", title: "Student Audience" },
              // In-person audience types
              { value: "conference", title: "Conference Attendees" },
              { value: "workshop", title: "Workshop Participants" },
              { value: "seminar", title: "Seminar Attendees" },
              { value: "tradeShow", title: "Trade Show Visitors" },
              { value: "networkingEvent", title: "Networking Event Attendees" },
              {value: "communityGathering",title: "Community Gathering Participants"},
              { value: "panelDiscussion", title: "Panel Discussion Attendees" },
              // Additional audience types (political)
              { value: "conservative", title: "Conservative Audience" },
              { value: "liberal", title: "Liberal Audience" },
              // Add more audience types as needed
            ],
          },
        }
      ],
    },
  ],
};
