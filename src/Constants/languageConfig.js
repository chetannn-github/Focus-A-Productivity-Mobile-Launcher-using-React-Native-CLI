export const langConfig = {
    python: {
      fileName: "lock_protocol.py",
      kw: "def ",
      var: "gate_status",
      op: " = ",
      str: "True",
      func: "require_solutions",
      comment: "# ",
      indent: "    ",
      startBrace: ":",
      endBrace: " ",
      terminator: "",
      // CLI Dynamic Text
      cliPrompt: "$ ",
      cliCmd: "python3",
      cliArgs: " main.py --unlock",
      cliColor: "#3776AB" // Python Blue
    },
    cpp: {
      fileName: "lock_protocol.cpp",
      kw: "bool ",
      var: "isLocked",
      op: " = ",
      str: "true",
      func: "requireSolutions",
      comment: "// ",
      indent: "  ",
      startBrace: " {",
      endBrace: "};",
      terminator: ";",
      // CLI Dynamic Text
      cliPrompt: "# ",
      cliCmd: "./",
      cliArgs: "unlock_protocol",
      cliColor: "#00599C" // C++ Blue
    },
    java: {
      fileName: "LockProtocol.java",
      kw: "final boolean ",
      var: "isLocked",
      op: " = ",
      str: "true",
      func: "requireSolutions",
      comment: "// ",
      indent: "  ",
      startBrace: " {",
      endBrace: "}",
      terminator: ";",
      // CLI Dynamic Text
      cliPrompt: "C:\\> ",
      cliCmd: "java",
      cliArgs: " LockProtocol --unlock",
      cliColor: "#ED8B00" // Java Orange
    },
    typescript: {
      fileName: "lock_protocol.ts",
      kw: "const ",
      var: "status",
      op: " = ",
      str: '"LOCKED"',
      func: "requireSolutions",
      comment: "// ",
      indent: "  ",
      startBrace: " {",
      endBrace: "};",
      terminator: ";",
      // CLI Dynamic Text
      cliPrompt: "~ ",
      cliCmd: "npm run",
      cliArgs: " unlock",
      cliColor: "#61AFEF" // TS Blue
    }
  };