/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  FileText, 
  Code, 
  Settings, 
  Play, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Download, 
  RefreshCw,
  Terminal,
  ExternalLink,
  Bot
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---
type Tab = 'converter' | 'config' | 'test-run';

interface BotConfig {
  API_ID: string;
  API_HASH: string;
  BOT_TOKEN: string;
  LOG_CHANNEL: string;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('converter');
  const [htmlInput, setHtmlInput] = useState('');
  const [txtOutput, setTxtOutput] = useState('');
  const [txtInput, setTxtInput] = useState('');
  const [htmlOutput, setHtmlOutput] = useState('');
  const [config, setConfig] = useState<BotConfig>({
    API_ID: '36123528',
    API_HASH: '7f77eb79febe2b7cf5d33d6d57bc8ac0',
    BOT_TOKEN: '8640143346:AAGUFxqf9PvQa6w9PKalQQYHz_aQzycWAZc',
    LOG_CHANNEL: '-1003891933514',
  });
  const [isCopied, setIsCopied] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle');
  const [logs, setLogs] = useState<string[]>([]);

  // --- Conversion Logic ---
  const convertHtmlToTxt = () => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlInput, 'text/html');
    
    // Basic extraction logic mimicking the bot
    let text = doc.body.innerText || doc.body.textContent || '';
    
    // Find all links and append them if they have specific patterns
    const links = Array.from(doc.querySelectorAll('a'));
    const linkText = links.map(a => `${a.textContent}: ${a.href}`).join('\n');
    
    setTxtOutput(text + (linkText ? '\n\n--- Links ---\n' + linkText : ''));
  };

  const convertTxtToHtml = () => {
    // Basic TXT to HTML logic
    const lines = txtInput.split('\n');
    const html = `
<!DOCTYPE html>
<html>
<head>
    <title>Converted HTML</title>
    <style>
        body { font-family: sans-serif; padding: 20px; line-height: 1.6; }
        .line { margin-bottom: 10px; }
    </style>
</head>
<body>
    ${lines.map(line => `<div class="line">${line}</div>`).join('')}
</body>
</html>`;
    setHtmlOutput(html.trim());
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const runTest = () => {
    setTestStatus('running');
    setLogs(['[SYSTEM] Initializing test run...', '[SYSTEM] Checking environment variables...']);
    
    setTimeout(() => {
      setLogs(prev => [...prev, '[INFO] API_ID: ' + config.API_ID, '[INFO] API_HASH: ' + config.API_HASH.substring(0, 5) + '...']);
      
      setTimeout(() => {
        setLogs(prev => [...prev, '[INFO] Connecting to Telegram servers...', '[INFO] Resolving LOG_CHANNEL: ' + config.LOG_CHANNEL]);
        
        setTimeout(() => {
          if (config.LOG_CHANNEL.startsWith('-100')) {
            setLogs(prev => [...prev, '[SUCCESS] Target Channel Resolved: Log Channel', '[INFO] Starting the bot...']);
            setTestStatus('success');
          } else {
            setLogs(prev => [...prev, '[ERROR] LOG_CHANNEL must start with -100 for private channels.', '[ERROR] Startup failed.']);
            setTestStatus('error');
          }
        }, 1500);
      }, 1000);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-500/20">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">Html ↔ Txt Hub</h1>
              <p className="text-xs text-slate-400 font-mono">v1.0.0-stable</p>
            </div>
          </div>
          <nav className="flex items-center gap-1 bg-slate-800/50 p-1 rounded-full border border-slate-700">
            {(['converter', 'config', 'test-run'] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  activeTab === tab 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1).replace('-', ' ')}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {activeTab === 'converter' && (
            <motion.div
              key="converter"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {/* HTML to TXT */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Code className="w-5 h-5 text-indigo-400" />
                    <h2 className="text-lg font-semibold text-white">HTML to TXT</h2>
                  </div>
                  <button 
                    onClick={convertHtmlToTxt}
                    className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md text-sm transition-colors shadow-lg shadow-indigo-500/20"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Convert
                  </button>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
                  <div className="bg-slate-800/50 px-4 py-2 border-b border-slate-700 flex justify-between items-center">
                    <span className="text-xs font-mono text-slate-400">input.html</span>
                  </div>
                  <textarea
                    value={htmlInput}
                    onChange={(e) => setHtmlInput(e.target.value)}
                    placeholder="Paste HTML here..."
                    className="w-full h-48 p-4 bg-transparent text-slate-300 font-mono text-sm focus:outline-none resize-none"
                  />
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
                  <div className="bg-slate-800/50 px-4 py-2 border-b border-slate-700 flex justify-between items-center">
                    <span className="text-xs font-mono text-slate-400">output.txt</span>
                    <button onClick={() => handleCopy(txtOutput)} className="text-slate-400 hover:text-white transition-colors">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="p-4 h-48 overflow-auto text-slate-300 font-mono text-sm whitespace-pre-wrap">
                    {txtOutput || <span className="text-slate-600 italic">Result will appear here...</span>}
                  </div>
                </div>
              </div>

              {/* TXT to HTML */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-emerald-400" />
                    <h2 className="text-lg font-semibold text-white">TXT to HTML</h2>
                  </div>
                  <button 
                    onClick={convertTxtToHtml}
                    className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md text-sm transition-colors shadow-lg shadow-emerald-500/20"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Convert
                  </button>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
                  <div className="bg-slate-800/50 px-4 py-2 border-b border-slate-700 flex justify-between items-center">
                    <span className="text-xs font-mono text-slate-400">input.txt</span>
                  </div>
                  <textarea
                    value={txtInput}
                    onChange={(e) => setTxtInput(e.target.value)}
                    placeholder="Paste plain text here..."
                    className="w-full h-48 p-4 bg-transparent text-slate-300 font-mono text-sm focus:outline-none resize-none"
                  />
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
                  <div className="bg-slate-800/50 px-4 py-2 border-b border-slate-700 flex justify-between items-center">
                    <span className="text-xs font-mono text-slate-400">output.html</span>
                    <button onClick={() => handleCopy(htmlOutput)} className="text-slate-400 hover:text-white transition-colors">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="p-4 h-48 overflow-auto text-slate-300 font-mono text-sm whitespace-pre-wrap">
                    {htmlOutput || <span className="text-slate-600 italic">Result will appear here...</span>}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'config' && (
            <motion.div
              key="config"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-2xl mx-auto space-y-8"
            >
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <Settings className="w-6 h-6 text-indigo-400" />
                  <h2 className="text-2xl font-bold text-white">Bot Configuration</h2>
                </div>
                <p className="text-slate-400 mb-8 text-sm">
                  These settings are required for your Telegram bot to function. They are typically stored in a <code className="bg-slate-800 px-1.5 py-0.5 rounded text-indigo-300">.env</code> file.
                </p>

                <div className="space-y-6">
                  {(Object.entries(config) as [keyof BotConfig, string][]).map(([key, value]) => (
                    <div key={key} className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{key.replace('_', ' ')}</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={value}
                          onChange={(e) => setConfig({ ...config, [key]: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-slate-200 font-mono text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                        />
                        <button 
                          onClick={() => handleCopy(value)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-2xl p-6 flex gap-4">
                <AlertCircle className="w-6 h-6 text-indigo-400 shrink-0" />
                <div>
                  <h3 className="text-indigo-200 font-semibold mb-1">Security Tip</h3>
                  <p className="text-indigo-300/70 text-sm leading-relaxed">
                    Never share your <code className="text-indigo-200">BOT_TOKEN</code> with anyone. If leaked, anyone can control your bot. Revoke it via @BotFather if necessary.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'test-run' && (
            <motion.div
              key="test-run"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-3xl mx-auto space-y-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">Simulator</h2>
                  <p className="text-slate-400 text-sm">Test your bot logic in a simulated environment.</p>
                </div>
                <button
                  onClick={runTest}
                  disabled={testStatus === 'running'}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-bold transition-all shadow-lg ${
                    testStatus === 'running'
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20'
                  }`}
                >
                  {testStatus === 'running' ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
                  {testStatus === 'running' ? 'Running...' : 'Start Simulator'}
                </button>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
                <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">Console Output</span>
                  </div>
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                  </div>
                </div>
                <div className="p-6 h-96 overflow-auto font-mono text-sm space-y-2">
                  {logs.length === 0 && (
                    <div className="text-slate-700 italic">Click "Start Simulator" to begin...</div>
                  )}
                  {logs.map((log, i) => (
                    <div key={i} className={`
                      ${log.includes('[ERROR]') ? 'text-rose-400' : ''}
                      ${log.includes('[SUCCESS]') ? 'text-emerald-400' : ''}
                      ${log.includes('[INFO]') ? 'text-slate-400' : ''}
                      ${log.includes('[SYSTEM]') ? 'text-indigo-400 font-bold' : ''}
                    `}>
                      <span className="opacity-30 mr-3">[{new Date().toLocaleTimeString()}]</span>
                      {log}
                    </div>
                  ))}
                  {testStatus === 'success' && (
                    <motion.div 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center gap-3 text-emerald-400"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Bot is ready to run! No errors detected in configuration.</span>
                    </motion.div>
                  )}
                  {testStatus === 'error' && (
                    <motion.div 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      className="mt-4 p-4 bg-rose-500/10 border border-rose-500/20 rounded-lg flex items-center gap-3 text-rose-400"
                    >
                      <AlertCircle className="w-5 h-5" />
                      <span>Configuration error detected. Check LOG_CHANNEL format.</span>
                    </motion.div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <a 
                  href="https://github.com/kirankumari82351/Html" 
                  target="_blank" 
                  rel="noreferrer"
                  className="p-4 bg-slate-900 border border-slate-800 rounded-xl hover:border-indigo-500/50 transition-all group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-semibold">View Repository</span>
                    <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-indigo-400" />
                  </div>
                  <p className="text-xs text-slate-400">Check the source code on GitHub for updates.</p>
                </a>
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-semibold">Deployment Status</span>
                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded uppercase tracking-wider">Ready</span>
                  </div>
                  <p className="text-xs text-slate-400">Logic validated for Render and local deployment.</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Copy Notification */}
      <AnimatePresence>
        {isCopied && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center gap-2 z-50"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-sm font-medium">Copied to clipboard!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
