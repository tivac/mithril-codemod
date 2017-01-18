"use strict";

var fs   = require("fs"),

    o         = require("ospec"),
    execa     = require("execa"),
    disparity = require("disparity"),
    
    transforms = require("../index.js");

function noop() { }

o.spec("mithril-codemod", () => {
    Object.keys(transforms).forEach((type) =>
        o.spec(type, () =>
            transforms[type].forEach((t) =>
                o(t.name, () => {
                    var fn    = require(t.file),
                        input = `./transforms/${t.name}/_input.js`,
                        result, diff;
                    
                    result = fn({
                        path   : input,
                        source : fs.readFileSync(input, "utf8")
                    }, {
                        jscodeshift : require("jscodeshift"),
                        
                        stats : noop
                    });

                    diff = disparity.unified(
                        fs.readFileSync(`./transforms/${t.name}/_output.js`, "utf8").trim(),
                        result.trim(),
                        {
                            paths : [
                                `/transforms/${t.name}/_input.js (transformed)`,
                                `./transforms/${t.name}/_output.js`
                            ]
                        }
                    );

                    o(diff).equals("")(`\n${diff}`);
                })
            )
        )
    );

    // o.spec("cli", () => {
    //     var cli = require.resolve("../bin/cli.js");

    //     o("should show help when no paths are provided", (done, timeout) => {
    //         timeout(500);
            
    //         execa(cli).then((result) => {
    //             console.log("result", result);

    //             done();
    //         })
    //         .catch((error) => {
    //             console.log("error", error);
                
    //             done();
    //         });
    //     })
    // });
});

o.run();
