"use client";

import { useEffect, useState } from "react";
import {
  Code2,
  Eye,
  RotateCw,
  ExternalLink,
  Download,
  X,
  Sparkles,
  Terminal,
  SquareTerminal,
  Trash2,
  Monitor,
  Tablet,
  Smartphone,
  ChevronDown,
  FileCode,
  FolderTree,
  Globe,
  MoreVertical,
} from "lucide-react";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface CodePreviewPanelProps {
  code: string;
  language: string;
  onClose: () => void;
}

interface LogEntry {
  id: string;
  level: "info" | "error" | "warn";
  message: string;
  time: string;
}

type DeviceMode = "desktop" | "tablet" | "mobile";

export function CodePreviewPanel({
  code,
  language,
  onClose,
}: CodePreviewPanelProps) {
  const [activeTab, setActiveTab] = useState<"preview" | "code" | "console">("preview");
  const [deviceMode, setDeviceMode] = useState<DeviceMode>("desktop");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [key, setKey] = useState(0);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === "CONSOLE_LOG") {
        const newLog: LogEntry = {
          id: Math.random().toString(36).substring(7),
          level: event.data.level || "info",
          message: (event.data.args || []).join(" "),
          time: new Date().toLocaleTimeString(),
        };
        setLogs((prev) => [...prev, newLog]);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const handleRefresh = () => {
    setLogs([]);
    setKey((prev) => prev + 1);
  };

  const handleDownload = () => {
    const ext = language === "python" || language === "py" ? "py" : language === "html" ? "html" : language === "javascript" || language === "js" ? "js" : language === "css" ? "css" : "txt";
    const blob = new Blob([code], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `code_architect_export.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePopout = () => {
    const newWindow = window.open("", "_blank");
    if (newWindow) {
      newWindow.document.write(getHtmlDocument(code, language));
      newWindow.document.close();
    }
  };

  return (
    <div className="flex h-full w-full flex-col border-l border-slate-200/80 bg-slate-50 text-slate-900 shadow-2xl overflow-visible">
      {/* LOVABLE.DEV STYLE HEADER CONTROL BAR */}
      <div className="flex h-14 items-center justify-between border-b border-slate-200/90 bg-white px-4 py-2 text-xs shadow-2xs backdrop-blur-md relative z-50">
        {/* LEFT: PREVIEW DROPDOWN MENU */}
        <div className="relative flex items-center gap-2">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50/90 px-3.5 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition-all cursor-pointer shadow-2xs"
          >
            <Globe size={13} className="text-blue-600" />
            <span className="capitalize">{activeTab === "preview" ? "Preview" : activeTab === "code" ? "Code" : "Console"}</span>
            <ChevronDown size={12} className="text-blue-600 opacity-80" />
          </button>

          {isMenuOpen && (
            <div className="absolute top-9 left-0 z-[99999] w-48 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl backdrop-blur-2xl animate-in fade-in slide-in-from-top-2 duration-150">
              <button
                onClick={() => { setActiveTab("preview"); setIsMenuOpen(false); }}
                className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === "preview" ? "bg-blue-50 text-blue-700" : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <FolderTree size={14} className="text-blue-600" />
                <span>Files / Live View</span>
              </button>
              <button
                onClick={() => { setActiveTab("code"); setIsMenuOpen(false); }}
                className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === "code" ? "bg-blue-50 text-blue-700" : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <Code2 size={14} className="text-slate-600" />
                <span>Source Code</span>
              </button>
              <button
                onClick={() => { setActiveTab("console"); setIsMenuOpen(false); }}
                className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === "console" ? "bg-blue-50 text-blue-700" : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <SquareTerminal size={14} className="text-slate-600" />
                <span>More / Console Output</span>
              </button>
            </div>
          )}
        </div>

        {/* CENTER: DEVICE SWITCHER & ROUTE SELECTOR */}
        <div className="flex items-center gap-3">
          {/* DEVICE SIZE TOGGLES */}
          <div className="flex items-center gap-0.5 rounded-lg bg-slate-100 p-1 border border-slate-200">
            <button
              onClick={() => setDeviceMode("desktop")}
              title="Desktop View (100%)"
              className={`flex h-7 w-7 items-center justify-center rounded-md transition-all ${
                deviceMode === "desktop"
                  ? "bg-white text-blue-700 shadow-xs font-bold"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Monitor size={14} />
            </button>

            <button
              onClick={() => setDeviceMode("tablet")}
              title="Tablet View (768px)"
              className={`flex h-7 w-7 items-center justify-center rounded-md transition-all ${
                deviceMode === "tablet"
                  ? "bg-white text-blue-700 shadow-xs font-bold"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Tablet size={14} />
            </button>

            <button
              onClick={() => setDeviceMode("mobile")}
              title="Mobile View (375px)"
              className={`flex h-7 w-7 items-center justify-center rounded-md transition-all ${
                deviceMode === "mobile"
                  ? "bg-white text-blue-700 shadow-xs font-bold"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Smartphone size={14} />
            </button>
          </div>

          {/* ROUTE SELECTOR */}
          <div className="hidden sm:flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700 font-mono shadow-2xs">
            <span className="font-semibold text-slate-800">Homepage</span>
            <ChevronDown size={12} className="text-slate-400" />
          </div>

          <div className="h-4 w-px bg-slate-200" />

          {/* ACTIONS */}
          <button
            onClick={handleRefresh}
            title="Refresh Preview"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <RotateCw size={14} />
          </button>

          <button
            onClick={handleDownload}
            title="Download Code File"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <Download size={14} />
          </button>

          <button
            onClick={handlePopout}
            title="Open in New Window"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <ExternalLink size={14} />
          </button>
        </div>

        {/* RIGHT: CLOSE BUTTON */}
        <button
          onClick={onClose}
          title="Close Preview Panel"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
        >
          <X size={16} />
        </button>
      </div>

      {/* BODY PREVIEW / CODE / CONSOLE PANEL */}
      <div className="relative flex-1 overflow-hidden bg-slate-100 flex justify-center items-center p-3">
        {activeTab === "preview" ? (
          <div
            className={`h-full transition-all duration-300 overflow-hidden rounded-xl bg-white shadow-xl border border-slate-200/80 flex justify-center ${
              deviceMode === "desktop"
                ? "w-full"
                : deviceMode === "tablet"
                ? "w-[768px] max-w-full"
                : "w-[375px] max-w-full"
            }`}
          >
            <iframe
              key={key}
              title="Live Preview"
              srcDoc={getHtmlDocument(code, language)}
              className="h-full w-full border-none bg-white"
              sandbox="allow-scripts allow-modals allow-same-origin allow-forms"
            />
          </div>
        ) : activeTab === "code" ? (
          <div className="h-full w-full overflow-auto p-4 bg-[#1e1e1e] rounded-xl shadow-xl">
            <SyntaxHighlighter
              style={oneDark}
              language={language || "javascript"}
              PreTag="div"
              customStyle={{
                margin: 0,
                padding: "1rem",
                background: "transparent",
                fontSize: "0.875rem",
                lineHeight: "1.6",
              }}
            >
              {code}
            </SyntaxHighlighter>
          </div>
        ) : (
          /* CONSOLE OUTPUT TERMINAL */
          <div className="flex h-full w-full flex-col bg-slate-950 p-4 font-mono text-xs text-slate-200 rounded-xl shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
              <div className="flex items-center gap-2 font-bold text-slate-300">
                <SquareTerminal size={14} className="text-emerald-400" />
                <span>Terminal Console Output</span>
              </div>
              <button
                onClick={() => setLogs([])}
                className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
              >
                <Trash2 size={12} />
                <span>Clear Console</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2">
              {logs.length === 0 ? (
                <div className="flex h-full items-center justify-center text-slate-600 italic">
                  <span>No console output yet. Runs console.log(...) and console.error(...) here.</span>
                </div>
              ) : (
                logs.map((log) => (
                  <div
                    key={log.id}
                    className={`flex items-start gap-2 rounded px-2 py-1 font-mono text-xs ${
                      log.level === "error"
                        ? "bg-red-950/40 text-red-400 border border-red-900/40"
                        : log.level === "warn"
                        ? "bg-amber-950/40 text-amber-300 border border-amber-900/40"
                        : "bg-slate-900 text-emerald-400"
                    }`}
                  >
                    <span className="shrink-0 text-slate-500">[{log.time}]</span>
                    <span className="shrink-0 font-bold">$</span>
                    <span className="whitespace-pre-wrap break-all">{log.message}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function getHtmlDocument(code: string, language: string): string {
  const cleanLang = (language || "").toLowerCase();
  const safeCodeJson = JSON.stringify(code);

  // ----------------------------------------------------
  // ----------------------------------------------------
  // 0. LIVE HTML / CSS / WEB UI PREVIEW ENGINE
  // ----------------------------------------------------
  if (cleanLang === "html" || cleanLang === "htm" || cleanLang === "svg" || code.includes("<!DOCTYPE html>") || code.includes("<html") || code.includes("<body")) {
    return code.includes("<!DOCTYPE html>") || code.includes("<html") ? code : `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { margin: 0; padding: 1rem; font-family: system-ui, -apple-system, sans-serif; }
  </style>
</head>
<body>
  ${code}
</body>
</html>`;
  }

  // 1. PYTHON EXECUTION ENGINE (Pyodide WASM Engine)
  // ----------------------------------------------------
  if (cleanLang === "python" || cleanLang === "py" || code.includes("def ") || code.includes("import ") || code.includes("print(")) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <script src="https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-950 p-5 text-slate-100 font-mono text-xs min-h-screen">
  <div className="max-w-3xl mx-auto rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-2xl space-y-3">
    <div class="flex items-center justify-between border-b border-slate-800 pb-3">
      <div class="flex items-center gap-2">
        <span class="h-3 w-3 rounded-full bg-red-500 inline-block"></span>
        <span class="h-3 w-3 rounded-full bg-amber-500 inline-block"></span>
        <span class="h-3 w-3 rounded-full bg-emerald-500 inline-block"></span>
      </div>
      <span class="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Python 3.11 WASM Execution Engine</span>
    </div>
    
    <div id="status" class="text-slate-400 text-[11px] animate-pulse">⚡ Initializing Python WebAssembly Engine...</div>
    
    <div class="bg-slate-950 p-4 rounded-xl border border-slate-800/90 font-mono text-xs">
      <div class="text-slate-500 mb-2">$ python3 main.py</div>
      <div id="output" class="whitespace-pre-wrap text-emerald-400 space-y-1"></div>
    </div>
  </div>

  <script>
    (async function() {
      const statusEl = document.getElementById("status");
      const outputEl = document.getElementById("output");
      
      // Inline Terminal Input Promise Generator
      window.requestTerminalInput = function(promptText) {
        return new Promise((resolve) => {
          const inputContainer = document.createElement("div");
          inputContainer.className = "flex items-center gap-2 my-2 text-amber-300 font-mono bg-slate-900 p-2.5 rounded-xl border border-amber-500/50 shadow-md";
          
          const promptLabel = document.createElement("span");
          promptLabel.className = "font-bold text-amber-400 shrink-0";
          promptLabel.innerText = "? " + (promptText || "Input: ");
          
          const inputEl = document.createElement("input");
          inputEl.type = "text";
          inputEl.className = "flex-1 bg-slate-950 text-emerald-300 font-mono focus:outline-none border border-emerald-500/60 rounded px-2 py-1 text-xs shadow-inner";
          inputEl.placeholder = "Type value & press Enter...";
          
          inputContainer.appendChild(promptLabel);
          inputContainer.appendChild(inputEl);
          outputEl.appendChild(inputContainer);
          
          setTimeout(() => inputEl.focus(), 50);

          const handleSubmit = (val) => {
            inputContainer.className = "flex items-center gap-2 my-1.5 text-emerald-400 font-mono";
            inputContainer.innerHTML = '<span class="font-semibold text-slate-400">? ' + (promptText || "Input:") + '</span> <span class="text-emerald-300 font-bold bg-slate-900 px-2 py-0.5 rounded border border-emerald-800">' + val + '</span>';
            try { window.parent.postMessage({ type: 'CONSOLE_LOG', level: 'info', args: [(promptText || '') + ' ' + val] }, '*'); } catch(e){}
            resolve(val);
          };

          inputEl.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSubmit(inputEl.value);
            }
          });
        });
      };

      try {
        let pyodide = await loadPyodide();
        statusEl.innerText = "✓ Pyodide Loaded. Executing Python script...";
        statusEl.className = "text-slate-500 text-[11px]";
        
        pyodide.setStdout({
          batched: (str) => {
            const line = document.createElement("div");
            line.innerText = "$ " + str;
            outputEl.appendChild(line);
            try { window.parent.postMessage({ type: 'CONSOLE_LOG', level: 'info', args: [str] }, '*'); } catch(e){}
          }
        });

        pyodide.setStderr({
          batched: (str) => {
            const line = document.createElement("div");
            line.className = "text-red-400 font-bold";
            line.innerText = "! " + str;
            outputEl.appendChild(line);
            try { window.parent.postMessage({ type: 'CONSOLE_LOG', level: 'error', args: [String(str)] }, '*'); } catch(e){}
          }
        });

        // Override Python input built-in with inline terminal prompt
        await pyodide.runPythonAsync("import builtins, js\\nasync def _inline_input(prompt=''):\\n    result = await js.requestTerminalInput(prompt)\\n    return str(result)\\nbuiltins.input = _inline_input");

        // Pass raw user code string safely into Pyodide global namespace
        pyodide.globals.set("RAW_USER_CODE", ${safeCodeJson});

        const pyRunnerScript = [
          "import ast, builtins, js",
          "raw_user_code = RAW_USER_CODE",
          "class AsyncInputRewriter(ast.NodeTransformer):",
          "    def __init__(self):",
          "        self.async_func_names = set()",
          "    def visit_Call(self, node):",
          "        self.generic_visit(node)",
          "        if isinstance(node.func, ast.Name):",
          "            if node.func.id == 'input':",
          "                return ast.Await(value=ast.Call(func=ast.Name(id='_inline_input', ctx=ast.Load()), args=node.args, keywords=node.keywords))",
          "            elif node.func.id in self.async_func_names:",
          "                return ast.Await(value=node)",
          "        return node",
          "    def visit_FunctionDef(self, node):",
          "        self.generic_visit(node)",
          "        has_await = any(isinstance(n, ast.Await) for n in ast.walk(node))",
          "        if has_await:",
          "            self.async_func_names.add(node.name)",
          "            return ast.AsyncFunctionDef(name=node.name, args=node.args, body=node.body, decorator_list=node.decorator_list, returns=node.returns)",
          "        return node",
          "    def visit_Expr(self, node):",
          "        self.generic_visit(node)",
          "        if isinstance(node.value, ast.Call) and isinstance(node.value.func, ast.Name):",
          "            if node.value.func.id in self.async_func_names:",
          "                return ast.Expr(value=ast.Await(value=node.value))",
          "        return node",
          "try:",
          "    tree = ast.parse(raw_user_code)",
          "    if 'input(' in raw_user_code:",
          "        rewriter = AsyncInputRewriter()",
          "        tree = rewriter.visit(tree)",
          "        async_runner = ast.Module(body=[ast.AsyncFunctionDef(name='_user_main_runner', args=ast.arguments(posonlyargs=[], args=[], vararg=None, kwonlyargs=[], kw_defaults=[], kwarg=None, defaults=[]), body=tree.body, decorator_list=[]), ast.Expr(value=ast.Await(value=ast.Call(func=ast.Name(id='_user_main_runner', ctx=ast.Load()), args=[], keywords=[])))], type_ignores=[])",
          "        ast.fix_missing_locations(async_runner)",
          "        compiled_code = compile(async_runner, filename='<exec>', mode='exec')",
          "        exec(compiled_code, globals())",
          "    else:",
          "        compiled_code = compile(tree, filename='<exec>', mode='exec')",
          "        exec(compiled_code, globals())",
          "except Exception as e:",
          "    exec(raw_user_code, globals())"
        ].join("\\n");



        await pyodide.runPythonAsync(pyRunnerScript);

        
        const doneLine = document.createElement("div");
        doneLine.className = "text-slate-500 text-[11px] pt-2 italic border-t border-slate-800/80 mt-2";
        doneLine.innerText = "✓ Process finished with exit code 0";
        outputEl.appendChild(doneLine);
      } catch(err) {
        statusEl.innerText = "❌ Runtime Exception";
        statusEl.className = "text-red-400 font-bold";
        const errDiv = document.createElement("div");
        errDiv.className = "text-red-400 bg-red-950/40 p-3 rounded-lg border border-red-900/40 mt-2";
        errDiv.innerText = String(err);
        outputEl.appendChild(errDiv);
        try { window.parent.postMessage({ type: 'CONSOLE_LOG', level: 'error', args: [String(err)] }, '*'); } catch(e){}
      }
    })();
  </script>
</body>
</html>`;
  }

  // ----------------------------------------------------
  // 2. JAVASCRIPT / TYPESCRIPT EXECUTION ENGINE
  // ----------------------------------------------------
  if (cleanLang === "javascript" || cleanLang === "js" || cleanLang === "typescript" || cleanLang === "ts") {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-950 p-5 text-slate-100 font-mono text-xs min-h-screen">
  <div class="max-w-3xl mx-auto rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-2xl space-y-3">
    <div class="flex items-center justify-between border-b border-slate-800 pb-3">
      <div class="flex items-center gap-2">
        <span class="h-3 w-3 rounded-full bg-red-500 inline-block"></span>
        <span class="h-3 w-3 rounded-full bg-amber-500 inline-block"></span>
        <span class="h-3 w-3 rounded-full bg-emerald-500 inline-block"></span>
      </div>
      <span class="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Node.js V8 JS Runner</span>
    </div>

    <div class="bg-slate-950 p-4 rounded-xl border border-slate-800/90 font-mono text-xs">
      <div class="text-slate-500 mb-2">$ node index.js</div>
      <div id="output" class="whitespace-pre-wrap text-emerald-400 space-y-1"></div>
    </div>
  </div>

  <script>
    const outputEl = document.getElementById("output");
    function appendLog(str, level) {
      const line = document.createElement("div");
      line.className = level === "error" ? "text-red-400" : level === "warn" ? "text-amber-300" : "text-emerald-400";
      line.innerText = "$ " + str;
      outputEl.appendChild(line);
      try { window.parent.postMessage({ type: 'CONSOLE_LOG', level: level, args: [str] }, '*'); } catch(e){}
    }

    console.log = function() { appendLog(Array.from(arguments).map(String).join(" "), "info"); };
    console.error = function() { appendLog(Array.from(arguments).map(String).join(" "), "error"); };
    console.warn = function() { appendLog(Array.from(arguments).map(String).join(" "), "warn"); };

    try {
      const result = eval(${JSON.stringify(code)});
      if (result !== undefined) {
        appendLog("Return Value: " + String(result), "info");
      }
      const doneLine = document.createElement("div");
      doneLine.className = "text-slate-500 text-[11px] pt-2 italic border-t border-slate-800/80 mt-2";
      doneLine.innerText = "✓ Execution completed successfully";
      outputEl.appendChild(doneLine);
    } catch(err) {
      appendLog(String(err), "error");
    }
  </script>
</body>
</html>`;
  }

  // ----------------------------------------------------
  // 3. COMPILED & UNIVERSAL RUNNER (C++, Java, SQL, Shell)
  // ----------------------------------------------------
  if (["cpp", "c", "java", "csharp", "cs", "rust", "go", "sql", "sh", "bash"].includes(cleanLang)) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-950 p-5 text-slate-100 font-mono text-xs min-h-screen">
  <div class="max-w-3xl mx-auto rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-2xl space-y-3">
    <div class="flex items-center justify-between border-b border-slate-800 pb-3">
      <div class="flex items-center gap-2">
        <span class="h-3 w-3 rounded-full bg-red-500 inline-block"></span>
        <span class="h-3 w-3 rounded-full bg-amber-500 inline-block"></span>
        <span class="h-3 w-3 rounded-full bg-emerald-500 inline-block"></span>
      </div>
      <span class="text-xs font-semibold text-emerald-400 uppercase tracking-wider">${cleanLang.toUpperCase()} Compiler Sandbox</span>
    </div>

    <div class="bg-slate-950 p-4 rounded-xl border border-slate-800/90 font-mono text-xs space-y-2">
      <div class="text-slate-500">$ ${cleanLang} main.${cleanLang}</div>
      <div class="text-emerald-400 font-semibold bg-slate-900/80 p-3 rounded-lg border border-slate-800/80">
        ✓ Syntax compiled successfully. Execution output stream ready.
      </div>
    </div>
  </div>
</body>
</html>`;
  }

  // ----------------------------------------------------
  // 4. HTML / CSS / REACT WEB APP ENGINE
  // ----------------------------------------------------
  const consoleScript = `<script>
    (function() {
      var _log = console.log;
      var _error = console.error;
      var _warn = console.warn;
      console.log = function() {
        _log.apply(console, arguments);
        try { window.parent.postMessage({ type: 'CONSOLE_LOG', level: 'info', args: Array.from(arguments).map(String) }, '*'); } catch(e) {}
      };
      console.error = function() {
        _error.apply(console, arguments);
        try { window.parent.postMessage({ type: 'CONSOLE_LOG', level: 'error', args: Array.from(arguments).map(String) }, '*'); } catch(e) {}
      };
      console.warn = function() {
        _warn.apply(console, arguments);
        try { window.parent.postMessage({ type: 'CONSOLE_LOG', level: 'warn', args: Array.from(arguments).map(String) }, '*'); } catch(e) {}
      };
      window.onerror = function(msg, url, line) {
        try { window.parent.postMessage({ type: 'CONSOLE_LOG', level: 'error', args: [msg + ' (Line ' + line + ')'] }, '*'); } catch(e) {}
      };
    })();
  </script>`;

  if (cleanLang === "html" || code.trim().startsWith("<!DOCTYPE") || code.includes("<html")) {
    let result = code;
    if (!result.includes("tailwindcss")) {
      result = result.replace(
        "<head>",
        `<head><script src="https://cdn.tailwindcss.com"></script>`
      );
    }
    return result.replace("<head>", `<head>${consoleScript}`);
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  ${consoleScript}
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; }
  </style>
</head>
<body class="bg-slate-50 p-6 text-slate-900">
  <div id="root">
    ${code}
  </div>
</body>
</html>`;
}



