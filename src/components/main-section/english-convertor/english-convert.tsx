/* eslint-disable no-debugger */
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ConvertorCss from "./english-convert.module.css";
import { useState, useRef } from "react";
import axios from "axios";
import { environment } from "../../../environment";

export default function EnglishConvertComponent() {
  const fetchPrompt = useRef<HTMLInputElement>(null);

  const [userPromptAndAnswer, setUserPromptAndAnswer] = useState<string[]>(
    () => {
      return [];
    }
  );
  const [disabledInputs, setDisabledInputs] = useState<boolean>(false);

  const mutatePromptAndAnswerState = (): void => {
    let newState: string[] = [...userPromptAndAnswer];
    newState.push(fetchPrompt!.current!.value);
    setUserPromptAndAnswer(newState);

    chatGptPromptAnswerApi(fetchPrompt!.current!.value).then(
      (chatGptMesg: string) => {
        setUserPromptAndAnswer((prevs: any) => {
          return [...prevs, chatGptMesg];
        });
        fetchPrompt.current!.value = "";
        setDisabledInputs(false);
      }
    );
  };

  const getChatGptApiResponse = async (prompt: string) => {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content:
              "Explain it in simple and easy english of the given text: " +
              prompt,
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${"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"}`,
        },
      }
    );
    return response.data.choices[0].message?.content;
  };

  const chatGptPromptAnswerApi = async (prompt: string): Promise<string> => {
    const response: string = await getChatGptApiResponse(prompt);
    return response;
  };

  // submit button for prompt handler.
  const submitPrompt = (event: any): void => {
    if (event.key == "Enter") {
      mutatePromptAndAnswerState();
      setDisabledInputs(true);
    }

    if (event.type == "click") {
      mutatePromptAndAnswerState();
      setDisabledInputs(true);
    }
  };

  return (
    <>
      <div className={ConvertorCss["main-container"]}>
        <h1 className={ConvertorCss["easy-english"]}>
          Get easy readable english format!
        </h1>

        {/* Message section */}
        <div className={ConvertorCss["messages-section"]}>
          {userPromptAndAnswer.map((message: string, i: number) => {
            if (i % 2 == 0) {
              return (
                <div key={i} className={ConvertorCss["user-prompt"]}>
                  <img
                    src="/src/assets/My.JPG"
                    width="50px"
                    height="50px"
                    alt=""
                  />

                  <p>{message}</p>
                </div>
              );
            } else {
              return (
                <div key={i} className={ConvertorCss["chatGpt-ans"]}>
                  <img
                    src="/src/assets/my-bot.jpg"
                    width="50px"
                    height="50px"
                    alt=""
                  />

                  <p>{message}</p>
                </div>
              );
            }
          })}
          ;
          {disabledInputs == true ? (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div className={ConvertorCss["loading-container"]}>
                <div className={ConvertorCss["loading-text"]}>
                  <span>L</span>
                  <span>O</span>
                  <span>A</span>
                  <span>D</span>
                  <span>I</span>
                  <span>N</span>
                  <span>G</span>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* prompt section */}
        <div className={ConvertorCss["prompt-container"]}>
          <div className={ConvertorCss["input-container"]}>
            <input
              type="text"
              placeholder="Enter english sentence or phase here"
              className={ConvertorCss["main-input"]}
              onKeyDown={submitPrompt}
              ref={fetchPrompt}
              disabled={disabledInputs}
            />

            {disabledInputs === false ? (
              <FontAwesomeIcon
                icon={faPaperPlane}
                style={{
                  color: "white",
                  cursor: "pointer",
                  marginLeft: "-2rem",
                  marginTop: "0.8rem",
                }}
                onClick={submitPrompt}
              />
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}
