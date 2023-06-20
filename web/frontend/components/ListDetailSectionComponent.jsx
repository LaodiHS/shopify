import React, { useState } from "react";
import {
  IonItem,
  IonList,
  IonGrid,
  IonRow,
  IonCol,
  IonInput,
  IonButton,
  IonButtons,
  IonSelect,
  IonSelectOption,
  IonToolbar,
  IonContent,
  IonTextarea,
  IonLabel,
  IonAccordion,
  IonAccordionGroup,
  IonItemDivider
} from "@ionic/react";

import { Toggles } from "../components";
const audienceModel = {
  pageTitle: "Audience",
  sections: [
    {
      sectionTitle: "Target Audience",
      IonItems: [
        {
          IonElement: "ion-select",
          label: "Select Language",
          placeholder: "Select",
          category: "language",
          default: "english",
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
          IonElement: "ion-select",
          label: "Select Social Media Audience",
          placeholder: "Select",
          category: "social-media-audience",
          default: "none",
          values: {
            tag: "ion-select-option",
            options: [
              { value: "none", title: "none" },
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
            ],
          },
        },
        {
          IonElement: "ion-select",
          label: "Select Tone",
          placeholder: "Select",
          category: "tone",
          default: "none",
          multiple: false,
          values: {
            tag: "ion-select-option",
            options: [
              { value: "none", title: "None" },
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
          IonElement: "ion-select",
          label: "Western Narrative Device",
          placeholder: "Select",
          category: "narrative",
          default: "none",
          multiple: false,
          values: {
            tag: "ion-select-option",
            options: [
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
          IonElement: "ion-select",
          label: "Chinese Narrative Device",
          placeholder: "Select",
          category: "narrative",
          default: "huiyi",
          values: {
            tag: "ion-select-option",
            options: [
              {
                value: "huiyi",
                title: "Huiyi",
                definition:
                  "A narrative device similar to flashback, where the story transitions to a character's recollection of past events or memories, often emphasizing introspection and the character's emotional state.",
              },
              {
                value: "yuanchuang",
                title: "Yuanchuang",
                definition:
                  "The concept of original creation or originality, emphasizing unique and innovative storylines, characters, and settings.",
              },
              {
                value: "shenhua",
                title: "Shenhua",
                definition:
                  "Refers to myth or legend, incorporating elements of mythology and folklore, drawing inspiration from ancient tales and legendary creatures.",
              },
              {
                value: "fengsu",
                title: "Fengsu",
                definition:
                  "Depiction of customs or social practices, highlighting various aspects of traditional Chinese customs, rituals, and social norms.",
              },
              {
                value: "xianxia",
                title: "Xianxia",
                definition:
                  "A genre of Chinese fantasy literature that combines elements of martial arts, Taoism, and immortality, often revolving around characters cultivating their skills, ascending to higher realms, and exploring mystical worlds.",
              },
              {
                value: "guanxi",
                title: "Guanxi",
                definition:
                  "Refers to interpersonal relationships and social connections, playing a significant role in shaping character interactions, power dynamics, and plot developments.",
              },
            ],
          },
        },
        {
          IonElement: "ion-select",
          label: "Western Rhetorical Device",
          placeholder: "Select",
          category: "rhetorical",
          default: "none",
          multiple: true,
          values: {
            tag: "ion-select-option",
            options: [
              { value: "none", title: "None" },
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
          IonElement: "ion-select",
          label: "Chines Rhetorical Devices",
          placeholder: "Select",
          category: "rhetorical",
          default: "none",
          multiple: true,
          values: {
            tag: "ion-select-option",
            options: [
              { value: "none", title: "None" },
              {
                value: "yuzhou",
                title: "Yǔzhòu",
                definition:
                  "Metaphor or analogy used to convey meaning indirectly.",
              },
              {
                value: "biyu",
                title: "Bǐyǔ",
                definition:
                  "Simile, comparing two different things using 'like' or 'as' to illustrate a point.",
              },
              {
                value: "yinyu",
                title: "Yīnyǔ",
                definition:
                  "Allusion, referencing a well-known story, figure, or event to enhance understanding or make a point.",
              },
              {
                value: "ciju",
                title: "Cíjù",
                definition:
                  "Skillful use of concise and impactful words or phrases to evoke emotions or convey ideas.",
              },
              {
                value: "biti",
                title: "Bǐtì",
                definition:
                  "Comparative analogy, drawing parallels between different phenomena or situations to highlight similarities or differences.",
              },
              {
                value: "cihui",
                title: "Cíhuì",
                definition:
                  "Skillful manipulation and arrangement of words, phrases, or sentences to create memorable and impactful rhetoric.",
              },
              {
                value: "yinqing",
                title: "Yīnqíng",
                definition:
                  "Effective use of tonal variations, rhythm, and intonation to enhance the emotional impact of speech or writing.",
              },
              {
                value: "zhanjue",
                title: "Zhānjué",
                definition:
                  "Rhetorical strategies and tactics employed in debates or arguments to gain an advantage or persuade the audience.",
              },
              {
                value: "chenggong",
                title: "Chénggōng",
                definition:
                  "Praising the opponent's accomplishments or virtues to establish rapport or create a positive atmosphere.",
              },
              {
                value: "diyu",
                title: "Dìyù",
                definition:
                  "Satirical or mocking language used to criticize or ridicule opponents or their ideas.",
              },
              {
                value: "nanyu",
                title: "Nányǔ",
                definition:
                  "Use of paradoxes, puzzles, or challenging language to engage the audience and provoke deeper thinking.",
              },
              {
                value: "lixing",
                title: "Lìxìng",
                definition:
                  "Employing vivid examples or anecdotes to illustrate a point or reinforce an argument.",
              },
              {
                value: "chengyuan",
                title: "Chéngyuán",
                definition:
                  "Using appropriate anecdotes, quotations, or historical references to support arguments and add credibility.",
              },
              {
                value: "jushi",
                title: "Jùshǐ",
                definition:
                  "Skillful use of sentence structures, including parallelism, repetition, or antithesis, to create a rhythmic and persuasive effect.",
              },
              {
                value: "tixing",
                title: "Tǐxíng",
                definition:
                  "Adapting the style and tone of rhetoric to the specific situation or audience to maximize persuasive impact.",
              },
            ],
          },
        },
        {
          IonElement: "ion-select",
          label: "Arabic Rhetorical Devices",
          category: "rhetorical",
          placeholder: "Select",
          default: "none",
          multiple: true,
          values: {
            tag: "ion-select-option",
            options: [
              { value: "none", title: "None" },
              {
                value: "tashbih",
                title: "Tashbih",
                definition:
                  "Simile or comparison, drawing similarities between two different things to illustrate a point.",
              },
              {
                value: "tamthil",
                title: "Tamthil",
                definition:
                  "Analogy, using a familiar concept or idea to explain a more complex or abstract concept.",
              },
              {
                value: "majas",
                title: "Majas",
                definition:
                  "Figurative language, including metaphor, hyperbole, and irony, used to create impact and convey meaning.",
              },
              {
                value: "tawriyah",
                title: "Tawriyah",
                definition:
                  "Concealing one's intended meaning behind ambiguous or multiple interpretations.",
              },
              {
                value: "mukhatabah",
                title: "Mukhatabah",
                definition:
                  "Direct address or rhetorical apostrophe, speaking directly to an absent or imaginary person or object.",
              },
              {
                value: "iham",
                title: "Iham",
                definition:
                  "Rhetorical ambiguity, intentionally creating confusion or uncertainty to engage the audience's attention.",
              },
              {
                value: "jinas",
                title: "Jinas",
                definition:
                  "Punning or wordplay, using similar-sounding words with different meanings for humorous or rhetorical effect.",
              },
              {
                value: "qasamah",
                title: "Qasamah",
                definition:
                  "Swearing or oath-taking for emphasis or to establish credibility in making a point.",
              },
              {
                value: "inhiraf",
                title: "Inhiraf",
                definition:
                  "Deviation or diversion, intentionally veering off-topic to capture attention or introduce a new perspective.",
              },
              {
                value: "tamanni",
                title: "Tamanni",
                definition:
                  "Wishing or aspiration, expressing desires or hopes for a desired outcome or future state.",
              },
              {
                value: "isti'ara",
                title: "Isti'ara",
                definition:
                  "Metonymy or figurative substitution, using a related word or symbol to represent something else.",
              },
              {
                value: "mufakhara",
                title: "Mufakhara",
                definition:
                  "Boasting or self-praise, promoting one's achievements or qualities to establish superiority.",
              },
              {
                value: "ta'ajjub",
                title: "Ta'ajjub",
                definition:
                  "Expressing wonder, amazement, or astonishment to engage the audience and emphasize a point.",
              },
              {
                value: "kinayah",
                title: "Kinayah",
                definition:
                  "Indirect or allusive expression, hinting at a meaning without explicitly stating it.",
              },
              {
                value: "mujun",
                title: "Mujun",
                definition:
                  "Paradox or contradiction, using contradictory statements to stimulate thought or create emphasis.",
              },
            ],
          },
        },
      ],
    },
  ],
};

export function ListDetailSectionComponent({ data }) {
  const { pageTitle, sections } = audienceModel;
  const [hiddenElements, setHiddenElements] = useState([]);

  const handleToggleHide = (selectElementId) => {
    setHiddenElements([...hiddenElements, selectElementId]);
  };

  const handleToggleChange = (selectElementId) => {
    if (hiddenElements.includes(selectElementId)) {
      setHiddenElements(
        hiddenElements.filter(
          (hiddenCategory) => hiddenCategory !== selectElementId
        )
      );
    } else {
      setHiddenElements([...hiddenElements, selectElementId]);
    }
  };

  return (
    <>
      <h2>Product Detail</h2>
      <Toggles
        onToggleChange={handleToggleChange}
        toggles={[
          ["tone", false],
          ["narrative", false],
          ["rhetorical", false],
        ]}
      />
      <IonList>
        {sections.map((section, sectionIndex) => (
          <React.Fragment key={sectionIndex}>
            <IonItem>
              <h2>{section.sectionTitle}</h2>
            </IonItem>
            <IonGrid>
              {section.IonItems &&
                section.IonItems.map((item, itemIndex) => (
                  <IonRow key={itemIndex}>
                    <IonCol size="12" size-md="12">
                      <IonItem
                        class={
                          !hiddenElements.includes(item.category)
                            ? "ion-hide"
                            : "ion-show"
                        }
                      >
                        {item.IonElement && item.values && (
                          <item.IonElement
                            category={item.category}
                            multiple={item.multiple}
                            label={item.label}
                            placeholder={item.placeholder}
                            label-placement="stacked"
                          >
                            {item.values.options.map((sel, index) => (
                              <item.values.tag value={sel.value}>
                                {sel.title}
                              </item.values.tag>
                            ))}
                          </item.IonElement>
                        )}
                      </IonItem>
                    </IonCol>
                  </IonRow>
                ))}

              <IonRow>
                <IonCol size="12">
                  <IonAccordionGroup>
                    <IonAccordion value="first">
                      <IonItem slot="header" color="light">
                        <IonLabel>Description</IonLabel>
                      </IonItem>
                      <div className="ion-padding" slot="content">
                        <IonItem>
                          <ion-grid>
                            <ion-row>
                              <IonLabel>Description</IonLabel>
                              <IonTextarea
                                label="Description"
                                labelPlacement="floating"
                                placeholder="article"
                                autoGrow={true}
                                style={{ height: "100%", minHeight: "unset" }}
                                value="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris tellus sem, auctor accumsan egestas sed, venenatis at ex. Nam consequat ex odio, suscipit rhoncus orci dictum eget. Aenean sit amet ligula varius felis facilisis lacinia nec volutpat nulla. Duis ullamcorper sit amet turpis sed blandit. Integer pretium massa eu faucibus interdum."
                              ></IonTextarea>
                            </ion-row>
                            <ion-row>
                              <IonItemDivider>
                                <IonButtons slot="end">
                                  <IonButton>Generate Description</IonButton>
                                </IonButtons>
                              </IonItemDivider>
                            </ion-row>
                          </ion-grid>
                        </IonItem>
                        <IonItem>
                          <ion-grid>
                            <ion-row>
                              <IonLabel>Description HashTags</IonLabel>
                              <IonTextarea
                                label="Description Hash Tags"
                                labelPlacement="floating"
                                placeholder="article"
                                autoGrow={true}
                                style={{ height: "100%", minHeight: "unset" }}
                                value="hashtags has18 characters hash1 hash2 hash3 hash4 hash5 hash6 hash7 hash8 hash9 hash10 hash11 hash12 hash13 hash14 hash15 hash16 hash17 hash18 hash19 hash20 hash21 hash22 hash"
                              ></IonTextarea>
                            </ion-row>
                            <ion-row>
                              <IonItemDivider>
                                <IonButtons slot="end">
                                  <IonButton>Description HashTags</IonButton>
                                </IonButtons>
                              </IonItemDivider>
                            </ion-row>
                          </ion-grid>
                        </IonItem>
                      </div>
                    </IonAccordion>
                    <IonAccordion value="second">
                      <IonItem slot="header" color="light">
                        <IonLabel>Article</IonLabel>
                      </IonItem>
                      <div className="ion-padding" slot="content">
                        <IonItem>
                          <ion-grid>
                            <ion-row>
                              <IonLabel>Description</IonLabel>
                              <IonTextarea
                                label="Description"
                                labelPlacement="floating"
                                placeholder="article"
                                autoGrow={true}
                                style={{ height: "100%", minHeight: "unset" }}
                                value="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris tellus sem, auctor accumsan egestas sed, venenatis at ex. Nam consequat ex odio, suscipit rhoncus orci dictum eget. Aenean sit amet ligula varius felis facilisis lacinia nec volutpat nulla. Duis ullamcorper sit amet turpis sed blandit. Integer pretium massa eu faucibus interdum."
                              ></IonTextarea>
                            </ion-row>
                            <ion-row>
                              <IonItemDivider>
                                <IonButtons slot="end">
                                  <IonButton>Generate Description</IonButton>
                                </IonButtons>
                              </IonItemDivider>
                            </ion-row>
                          </ion-grid>
                        </IonItem>
                        <IonItem>
                          <ion-grid>
                            <ion-row>
                              <IonLabel>Description HashTags</IonLabel>
                              <IonTextarea
                                label="Description Hash Tags"
                                labelPlacement="floating"
                                placeholder="article"
                                autoGrow={true}
                                style={{ height: "100%", minHeight: "unset" }}
                                value="hashtags has18 characters hash1 hash2 hash3 hash4 hash5 hash6 hash7 hash8 hash9 hash10 hash11 hash12 hash13 hash14 hash15 hash16 hash17 hash18 hash19 hash20 hash21 hash22 hash"
                              ></IonTextarea>
                            </ion-row>
                            <ion-row>
                              <IonItemDivider>
                                <IonButtons slot="end">
                                  <IonButton>Description HashTags</IonButton>
                                </IonButtons>
                              </IonItemDivider>
                            </ion-row>
                          </ion-grid>
                        </IonItem>
                      </div>
                    </IonAccordion>
                    <IonAccordion value="third">
                      <IonItem slot="header" color="light">
                        <IonLabel>Posts</IonLabel>
                      </IonItem>
                      <div className="ion-padding" slot="content">
                        <IonItem>
                          <ion-grid>
                            <ion-row>
                              <IonLabel>Description</IonLabel>
                              <IonTextarea
                                label="Description"
                                labelPlacement="floating"
                                placeholder="article"
                                autoGrow={true}
                                style={{ height: "100%", minHeight: "unset" }}
                                value="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris tellus sem, auctor accumsan egestas sed, venenatis at ex. Nam consequat ex odio, suscipit rhoncus orci dictum eget. Aenean sit amet ligula varius felis facilisis lacinia nec volutpat nulla. Duis ullamcorper sit amet turpis sed blandit. Integer pretium massa eu faucibus interdum."
                              ></IonTextarea>
                            </ion-row>
                            <ion-row>
                              <IonItemDivider>
                                <IonButtons slot="end">
                                  <IonButton>Generate Description</IonButton>
                                </IonButtons>
                              </IonItemDivider>
                            </ion-row>
                          </ion-grid>
                        </IonItem>
                        <IonItem>
                          <ion-grid>
                            <ion-row>
                              <IonLabel>Description HashTags</IonLabel>
                              <IonTextarea
                                label="Description Hash Tags"
                                labelPlacement="floating"
                                placeholder="article"
                                autoGrow={true}
                                style={{ height: "100%", minHeight: "unset" }}
                                value="hashtags has18 characters hash1 hash2 hash3 hash4 hash5 hash6 hash7 hash8 hash9 hash10 hash11 hash12 hash13 hash14 hash15 hash16 hash17 hash18 hash19 hash20 hash21 hash22 hash"
                              ></IonTextarea>
                            </ion-row>
                            <ion-row>
                              <IonItemDivider>
                                <IonButtons slot="end">
                                  <IonButton>Description HashTags</IonButton>
                                </IonButtons>
                              </IonItemDivider>
                            </ion-row>
                          </ion-grid>
                        </IonItem>
                      </div>
                    </IonAccordion>
                  </IonAccordionGroup>
                </IonCol>
              </IonRow>
            </IonGrid>
          </React.Fragment>
        ))}
      </IonList>
    </>
  );
}
