// Generated by CoffeeScript 1.4.0
(function() {
  var CoverageInstrumentor, fs, parseArgs, path, printHelp, stripLeadingDot, version, _ref;

  fs = require('fs');

  path = require('path');

  path.sep = path.sep || "/";

  _ref = require('./coffeeCoverage'), CoverageInstrumentor = _ref.CoverageInstrumentor, version = _ref.version;

  stripLeadingDot = require('./helpers').stripLeadingDot;

  printHelp = function() {
    return console.log(usageString);
  };

  parseArgs = function(args) {
    var ArgumentParser, coverageVarDefault, excludeDefault, options, parser;
    ArgumentParser = require('argparse').ArgumentParser;
    parser = new ArgumentParser({
      version: version,
      addHelp: true,
      description: "Compiles CoffeeScript into JavaScript with JSCoverage-compatible instrumentation for code coverage."
    });
    parser.addArgument(['--verbose'], {
      help: "Verbose output",
      nargs: 0
    });
    coverageVarDefault = '_$jscoverage';
    parser.addArgument(['-c', '--coverageVar'], {
      help: "Set the name to use in the instrumented code for the coverage variable.  Defaults to\n'" + coverageVarDefault + "'.",
      metavar: "name",
      defaultValue: coverageVarDefault
    });
    excludeDefault = "node_modules,.git";
    parser.addArgument(['-e', '--exclude'], {
      help: "Comma delimited set of file names to exclude.  Any file or directory which is in\nthis list will be ignored.  Note that this field is case sensitive.  Defaults to\n'" + excludeDefault + "'.",
      metavar: "filenames",
      defaultValue: excludeDefault
    });
    parser.addArgument(['-i', '--initfile'], {
      help: "Write all global initialization out to 'file'.",
      metavar: "file"
    });
    parser.addArgument(['--path'], {
      help: "Specify how to show the path for each filename in the instrumented output.  If\n'pathtype' is 'relative', then the relative path will be written to each file.  If\n'pathtype' is 'abbr', then we replace each directory in the path with its first letter.\nThe default is 'none' which will write only the filename with no path.",
      metavar: "pathtype",
      choices: ['none', 'abbr', 'relative'],
      defaultValue: "none"
    });
    parser.addArgument(["src"], {
      help: "A file or directory to instrument.  If this is a directory, then all .coffee " + "files in this directory and all subdirectories will be instrumented."
    });
    parser.addArgument(["dest"], {
      help: "If src is a file then this must be a file to write the compiled JS code to. " + "If src is a directory, then this must be a directory.  This file or directory " + "will be created if it does not exist."
    });
    options = parser.parseArgs(args);
    if (options.exclude) {
      options.exclude = options.exclude.split(",");
    } else {
      options.exclude = [];
    }
    return options;
  };

  exports.main = function(args) {
    var coverageInstrumentor, options, result, _ref1;
    try {
      options = parseArgs(args.slice(2));
      coverageInstrumentor = new CoverageInstrumentor();
      if (options.verbose) {
        coverageInstrumentor.on("instrumentingFile", function(sourceFile, outFile) {
          return console.log("    " + (stripLeadingDot(sourceFile)) + " to " + (stripLeadingDot(outFile)));
        });
        coverageInstrumentor.on("instrumentingDirectory", function(sourceDir, outDir) {
          return console.log("Instrumenting directory: " + (stripLeadingDot(sourceDir)) + " to " + (stripLeadingDot(outDir)));
        });
        coverageInstrumentor.on("skip", function(file) {
          return console.log("    Skipping: " + (stripLeadingDot(file)));
        });
      }
      if (options.initfile) {
        options.initFileStream = fs.createWriteStream(options.initfile);
      }
      result = coverageInstrumentor.instrument(options.src, options.dest, options);
      if ((_ref1 = options.initFileStream) != null) {
        _ref1.end();
      }
      return console.log("Annotated " + result.lines + " lines.");
    } catch (err) {
      if (err.constructor.name === "CoverageError") {
        console.error("Error: " + err.message);
        return process.exit(1);
      } else {
        throw err;
      }
    }
  };

  if (require.main === module) {
    exports.main(process.argv);
  }

}).call(this);
