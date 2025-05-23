/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
/* tslint:disable */
// Copyright 2024 Google LLC

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

//     https://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { useRef, useState, useEffect, useCallback } from 'react';
import { generateContent, uploadFile } from './api';
import Chart from './Chart.jsx';
import functions from './functions';
import modes from './modes';
import { timeToSecs } from './utils';
import VideoPlayer from './VideoPlayer.jsx';
import UploadArea from './UploadArea';
import EmbedCode from './EmbedCode';
import { Theme, themes } from './themes';

const chartModes = Object.keys(modes.Chart.subModes);

export default function App() {
  const [vidUrl, setVidUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [timecodeList, setTimecodeList] = useState<any[]>(null);
  const [requestedTimecode, setRequestedTimecode] = useState<number | null>(null);
  const [selectedMode, setSelectedMode] = useState<string>(Object.keys(modes)[0]);
  const [activeMode, setActiveMode] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [isLoadingVideo, setIsLoadingVideo] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [chartMode, setChartMode] = useState(chartModes[0]);
  const [chartPrompt, setChartPrompt] = useState('');
  const [chartLabel, setChartLabel] = useState('');
  const [theme, setTheme] = useState<Theme>('dark-skeuo');
  const [showEmbedCode, setShowEmbedCode] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Apply theme when it changes
  useEffect(() => {
    const root = document.documentElement;
    Object.entries(themes[theme].styles).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
    root.className = themes[theme].className;
  }, [theme]);

  const handleFileSelect = useCallback(async (file: File) => {
    setIsLoadingVideo(true);
    setVideoError(false);
    
    try {
      const fileUrl = URL.createObjectURL(file);
      setVidUrl(fileUrl);
      setFile(file);
      
      // Reset any previous analysis
      setTimecodeList(null);
      setActiveMode(undefined);
      setCustomPrompt('');
    } catch (error) {
      console.error('Error processing file:', error);
      setVideoError(true);
    } finally {
      setIsLoadingVideo(false);
    }
  }, []);

  const isCustomMode = selectedMode === 'Custom';
  const isChartMode = selectedMode === 'Chart';
  const isCustomChartMode = isChartMode && chartMode === 'Custom';
  const hasSubMode = isCustomMode || isChartMode;

  const setTimecodes = ({timecodes}) =>
    setTimecodeList(
      timecodes.map((t) => ({...t, text: t.text.replaceAll("\\'", "'")})),
    );

  const onModeSelect = async (mode) => {
    setActiveMode(mode);
    setIsLoading(true);
    setChartLabel(chartPrompt);

    const resp = await generateContent(
      isCustomMode
        ? modes[mode].prompt(customPrompt)
        : isChartMode
          ? modes[mode].prompt(
              isCustomChartMode ? chartPrompt : modes[mode].subModes[chartMode],
            )
          : modes[mode].prompt,
      functions({
        set_timecodes: setTimecodes,
        set_timecodes_with_objects: setTimecodes,
        set_timecodes_with_numeric_values: ({timecodes}) =>
          setTimecodeList(timecodes),
      }),
      file,
    );

    const call = resp.functionCalls?.[0];

    if (call) {
      ({
        set_timecodes: setTimecodes,
        set_timecodes_with_objects: setTimecodes,
        set_timecodes_with_numeric_values: ({timecodes}) =>
          setTimecodeList(timecodes),
      })[call.name](call.args);
    }

    setIsLoading(false);
    scrollRef.current.scrollTo({top: 0});
  };

  const uploadVideo = async (e) => {
    e.preventDefault();
    setIsLoadingVideo(true);
    setVidUrl(URL.createObjectURL(e.dataTransfer.files[0]));

    const file = e.dataTransfer.files[0];

    try {
      const res = await uploadFile(file);
      setFile(res);
      setIsLoadingVideo(false);
    } catch (e) {
      setVideoError(true);
    }
  };

  const renderContent = (): React.ReactNode => {
    if (isLoading) {
      return <div className="loading">Waiting for model...</div>;
    }
    
    if (videoError) {
      return <div className="error">{videoError}</div>;
    }
    
    if (!vidUrl) {
      return (
        <UploadArea 
          onFileSelect={handleFileSelect} 
          isLoading={isLoadingVideo} 
        />
      );
    }
    
    return (
      <div className="analysis-container">
        <div className="video-container">
          {vidUrl && (
            <VideoPlayer
              url={vidUrl}
              requestedTimecode={requestedTimecode}
              timecodeList={timecodeList}
              jumpToTimecode={setRequestedTimecode}
              isLoadingVideo={isLoadingVideo}
              videoError={videoError}
            />
          )}
        </div>
        <div className="analysis-results">
          {isLoading ? (
            <div className="loading">Analyzing video...</div>
          ) : timecodeList ? (
            activeMode === 'Table' ? (
              <table>
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Description</th>
                    <th>Objects</th>
                  </tr>
                </thead>
                <tbody>
                  {timecodeList.map(({time, text, objects}, i) => (
                    <tr
                      key={i}
                      role="button"
                      onClick={() => setRequestedTimecode(timeToSecs(time))}>
                      <td>
                        <time>{time}</time>
                      </td>
                      <td>{text}</td>
                      <td>{objects.join(', ')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : activeMode === 'Chart' ? (
              <Chart
                data={timecodeList}
                yLabel={chartLabel}
                jumpToTimecode={setRequestedTimecode}
              />
            ) : modes[activeMode].isList ? (
              <ul>
                {timecodeList.map(({time, text}, i) => (
                  <li key={i} className="outputItem">
                    <button
                      onClick={() => setRequestedTimecode(timeToSecs(time))}>
                      <time>{time}</time>
                      <p className="text">{text}</p>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              timecodeList.map(({time, text}, i) => (
                <>
                  <span
                    key={i}
                    className="sentence"
                    role="button"
                    onClick={() => setRequestedTimecode(timeToSecs(time))}>
                    <time>{time}</time>
                    <span>{text}</span>
                  </span>{' '}
                </>
              ))
            )
          ) : null}
        </div>
      </div>
    );
  };

  return (
    <main
      className={theme}
      onDrop={uploadVideo}
      onDragOver={(e) => e.preventDefault()}
      onDragEnter={() => {}}
      onDragLeave={() => {}}>
      <section className="top">
        {vidUrl && !isLoadingVideo && (
          <>
            <div className={c('modeSelector', {hide: !showSidebar})}>
              {hasSubMode ? (
                <>
                  <div>
                    {isCustomMode ? (
                      <>
                        <h2>Custom prompt:</h2>
                        <textarea
                          placeholder="Type a custom prompt..."
                          value={customPrompt}
                          onChange={(e) => setCustomPrompt(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              onModeSelect(selectedMode);
                            }
                          }}
                          rows="5"
                        />
                      </>
                    ) : (
                      <>
                        <h2>Chart this video by:</h2>

                        <div className="modeList">
                          {chartModes.map((mode) => (
                            <button
                              key={mode}
                              className={c('button', {
                                active: mode === chartMode,
                              })}
                              onClick={() => setChartMode(mode)}>
                              {mode}
                            </button>
                          ))}
                        </div>
                        <textarea
                          className={c({active: isCustomChartMode})}
                          placeholder="Or type a custom prompt..."
                          value={chartPrompt}
                          onChange={(e) => setChartPrompt(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              onModeSelect(selectedMode);
                            }
                          }}
                          onFocus={() => setChartMode('Custom')}
                          rows="2"
                        />
                      </>
                    )}
                    <button
                      className="button generateButton"
                      onClick={() => onModeSelect(selectedMode)}
                      disabled={
                        (isCustomMode && !customPrompt.trim()) ||
                        (isChartMode &&
                          isCustomChartMode &&
                          !chartPrompt.trim())
                      }>
                      ▶️ Generate
                    </button>
                  </div>
                  <div className="backButton">
                    <button
                      onClick={() => setSelectedMode(Object.keys(modes)[0])}>
                      <span className="icon">chevron_left</span>
                      Back
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <h2>Explore this video via:</h2>
                    <div className="modeList">
                      {Object.entries(modes).map(([mode, {emoji}]) => (
                        <button
                          key={mode}
                          className={c('button', {
                            active: mode === selectedMode,
                          })}
                          onClick={() => setSelectedMode(mode)}>
                          <span className="emoji">{emoji}</span> {mode}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <button
                      className="button generateButton"
                      onClick={() => onModeSelect(selectedMode)}>
                      ▶️ Generate
                    </button>
                  </div>
                </>
              )}
            </div>
            <button
              className="collapseButton"
              onClick={() => setShowSidebar(!showSidebar)}>
              <span className="icon">
                {showSidebar ? 'chevron_left' : 'chevron_right'}
              </span>
            </button>
          </>
        )}

        <VideoPlayer
          url={vidUrl}
          requestedTimecode={requestedTimecode}
          timecodeList={timecodeList}
          jumpToTimecode={setRequestedTimecode}
          isLoadingVideo={isLoadingVideo}
          videoError={videoError}
        />
      </section>

      <div className={c('tools', {inactive: !vidUrl})}>
        <section
          className={c('output', {['mode' + activeMode]: activeMode})}
          ref={scrollRef}>
          {isLoading ? (
            <div className="loading">
              Waiting for model<span>...</span>
            </div>
          ) : timecodeList ? (
            activeMode === 'Table' ? (
              <table>
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Description</th>
                    <th>Objects</th>
                  </tr>
                </thead>
                <tbody>
                  {timecodeList.map(({time, text, objects}, i) => (
                    <tr
                      key={i}
                      role="button"
                      onClick={() => setRequestedTimecode(timeToSecs(time))}>
                      <td>
                        <time>{time}</time>
                      </td>
                      <td>{text}</td>
                      <td>{objects.join(', ')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : activeMode === 'Chart' ? (
              <Chart
                data={timecodeList}
                yLabel={chartLabel}
                jumpToTimecode={setRequestedTimecode}
              />
            ) : modes[activeMode].isList ? (
              <ul>
                {timecodeList.map(({time, text}, i) => (
                  <li key={i} className="outputItem">
                    <button
                      onClick={() => setRequestedTimecode(timeToSecs(time))}>
                      <time>{time}</time>
                      <p className="text">{text}</p>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              timecodeList.map(({time, text}, i) => (
                <>
                  <span
                    key={i}
                    className="sentence"
                    role="button"
                    onClick={() => setRequestedTimecode(timeToSecs(time))}>
                    <time>{time}</time>
                    <span>{text}</span>
                  </span>{' '}
                </>
              ))
            )
          ) : null}
        </section>
      </div>
    </main>
  );
}
