$(document).ready(function(){

	$('#user-input').click(function () {
		$(".input-container").slideToggle();
	});

	var language = {}

	language['C'] = '#include <stdio.h>\n\nint main(void) \n{\n	printf("Hello World!\\n");\n	return 0;\n}\n';
	language['CPP'] = '#include <iostream>\nusing namespace std;\n\nint main()\n{\n     cout << "Hello World!" << endl;\n     return 0;\n}\n';
	language['CLOJURE'] = '(println "Hello World!")';
	language['CSS'] = "p {\n font-size: 18px; \n}\n";
	language['CSHARP'] = 'using System;\nusing System.Numerics;\nclass Test {\n	static void Main(string[] args)	{\n	   /*\n		* \n		Read input from stdin and provide input before running\n		var line1 = System.Console.ReadLine().Trim();\n		var N = Int32.Parse(line1);\n		for (var i = 0; i < N; i++) {\n		System.Console.WriteLine("hello world");\n		}\n		*/\n\n		System.Console.WriteLine("Hello World!\\n");\n	}\n}\n';
	language['GO'] = 'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello World")\n}\n';
	language['HASKELL'] = 'module Main\n where\n\nmain=putStrLn "Hello World!\\n"';
	language['JAVA'] = 'class TestClass {\n    public static void main(String args[] ) throws Exception {\n        System.out.println("Hello World!");\n    }\n}\n';
	language['JAVASCRIPT'] = "importPackage(java.io);\nimportPackage(java.lang);\n\nprint ('Hello World!\\n');\n";
	language['LISP'] = '(display "Hello World!")\n';
	language['OBJECTIVEC'] = '#import <Foundation/Foundation.h>\nint main(int argc, const char* argv[]){\n    NSAutoreleasePool *pool = [[NSAutoreleasePool alloc] init];\n    printf("Hello World");\n    [pool drain];\n    return 0;\n}\n';
	language['PASCAL'] = "program Hello;\nbegin\n    writeln ('Hello World!')\nend.\n";
	language['PERL'] = "use strict;\n=comment\n# Read input from stdin and provide input before running code\n# Echo input to output.\nwhile(my $fred = <STDIN>) {\n    print $fred;\n}\n=cut\nprint 'Hello World!'\n";
	language['PHP'] = '<?php\n\necho "Hello World!";\n\n?>\n';
	language['PYTHON'] = "print 'Hello World!'\n";
	language['RUBY'] = "print 'Hello World!'\n";
	language['R'] = 'cat("Hello World")\n';
	language['RUST'] ='fn main() {\n    println!("Hello World!");\n}\n';
	language['SCALA'] = 'object HelloWorld {\n    def main(args: Array[String]) {\n        println("Hello, world!")\n    }\n}\n';
	language['TEXT'] = 'Paste the output here\n';

	//------From Ace Documentation on inserting the editor------//
	ace.require("ace/ext/language_tools");
	var editor = ace.edit("editor");
	var ongoing = false;
	var selectedLang = "CPP";
	editor.setTheme("ace/theme/dawn");
	editor.session.setMode("ace/mode/c_cpp");
	editor.getSession().setTabSize(5);
	var source_code = editor.getValue();
	editor.setFontSize(14);
	editor.setValue(language[selectedLang],-1);
	var StatusBar = ace.require("ace/ext/statusbar").StatusBar;
	var statusBar = new StatusBar(editor, document.getElementById("editor-statusbar"));
	editor.getSession().on('change', function(e) {
		updateContent();
		if(source_code == ""){
			$("#runcode").prop('disabled', true);
			$('#runcode').prop('title', "Editor is Empty! Please write some code.");
		}
		else{
			$("#runcode").prop('disabled', false);
			$('#runcode').prop('title', "Compile and Run");
		}
	});
	editor.session.getSelection().clearSelection();

	//To Download the code in the editor
	function download(content,lang){
		var e = {
			"C":"c","CPP":"cpp","CLOJURE":"clj","CSS":"css","CSHARP":"cs",
			"GO":"go","HASKELL":"hs","JAVA":"java","JAVASCRIPT":"js",
			"LISP":"scm","OBJECTIVEC":"m","PERL":"pl","PHP":"php",
			"PYTHON":"py","RUBY":"rb","R":"r","RUST":"rs","SCALA":"scala",
			"TEXT":"txt"
		};
		var element = document.createElement('a');
		element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
		element.setAttribute('download', "file." + e[lang]);
		element.style.display = 'none';
		document.body.appendChild(element);
		element.click();
		document.body.removeChild(element);
	}

	$("#download").click(function(){
		updateContent();
		download(source_code, $("#lang").val());

	});

	//To get the current contents in the editor
	function updateContent(){
		source_code = editor.getValue();
	}

	//To run the code and get all the status
	function runCode(){
		if(ongoing==true)
			return;
		ongoing = true;
		updateContent();
		$(".outputbox").hide();
		$("#runcode").prop('disabled', true);

		var token = $(":input[name='csrfmiddlewaretoken']").val();
		var input_given = $("#custom-input").val();
		var run_data = {
				source: source_code,
				lang: selectedLang,
				csrfmiddlewaretoken:token
		};
		if( $("#user-input").prop('checked') == true ){
			run_data.input = input_given;
		}

		// AJAX request to Django for running code
		$.ajax({
			url: "run/",
			type: "POST",
			data: run_data,
			dataType: "json",
			timeout: 1000000,
			success: function(response){

				ongoing = false;
				$("html, body").delay(150).animate({
						scrollTop: $('#showres').offset().top
				}, 1000);
				$(".outputbox").show();
				$("#runcode").prop('disabled', false);

				var cstat = response.compile_status;
				var rstat = response.run_status.status;
				if(cstat == "OK"){

					$(".compilestat").children(".value").html(response.compile_status);
					$(".runstat").children(".value").html(response.run_status.status);
					$(".time").children(".value").html(response.run_status.time_used);
					$(".memory").children(".value").html(response.run_status.memory_used);

					if(rstat == "AC"){
						$(".outputerror").hide();
						$(".io-show").show();
						$(".outputo").html(response.run_status.output_html).css("color", "#000");;
						if($("#user-input").prop('checked') == true)
							$(".outputi").html(input_given).css("color", "#000");
						else
							$(".outputi").html("Standard input is empty").css("color", "#a6a6a6");
					}
					else{
						$(".io-show").show();
						$(".outputo").html("Standard output is empty").css("color", "#a6a6a6");
						if($("#user-input").prop('checked') == true)
							$(".outputi").html(input_given).css("color", "#000");
						else
							$(".outputi").html("Standard input is empty").css("color", "#a6a6a6");
						$(".outputerror").show();
 
						if(rstat == "MLE"){
							$(".errorkey").html("Memory Error");
							$(".errormessage").html("Memory limit exceeded");
						}
						else if (rstat == "TLE"){
							$(".errorkey").html("Timeout Error");
							$(".errormessage").html("Time limit exceeded.");
						}
						else {
							$(".errorkey").html("Runtime Error");
							$(".errormessage").html(response.run_status.status_detail);
						}
					}
				}
				else{
					$(".io-show").show();
					$(".outputo").html("Standard output is empty").css("color", "#a6a6a6");
					if($("#user-input").prop('checked') == true)
						$(".outputi").html(input_given).css("color", "#000");
					else
						$(".outputi").html("Standard input is empty").css("color", "#a6a6a6");
					$(".time").children(".value").html("0.0");
					$(".memory").children(".value").html("0");
					$(".compilestat").children(".value").html("N/A");
					$(".runstat").children(".value").html("CE");

					$(".outputerror").show();
					$(".errorkey").html("Compile Error");
					$(".errormessage").html(response.compile_status);

				}
			},

			error: function(error){

				ongoing = false;
				$("html, body").delay(150).animate({
						scrollTop: $('#showres').offset().top
				}, 1000);

				$("#runcode").prop('disabled', false);
				$(".outputbox").show();
				$(".io-show").show();
				$(".outputo").html("Standard output is empty").css("color", "#a6a6a6");
				if($("#user-input").prop('checked') == true)
					$(".outputi").html(input_given).css("color", "#000");
				else
					$(".outputi").html("Standard input is empty").css("color", "#a6a6a6");
				$(".outputio").show();
				$(".time").children(".value").html("0.0");
				$(".memory").children(".value").html("0");
				$(".compilestat").children(".value").html("N/A");
				$(".runstat").children(".value").html("N/A");

				$(".errorkey").html("Server error");
				$(".errormessage").html("Bad Request(403). Please try again!");


			}
		});
	}

	$("#runcode").click(function(){
		runCode();
	});

	//When Changing the language
	$("#lang").change(function(){
		selectedLang = $("#lang").val();
		editor.setValue(language[selectedLang],-1);
		if(selectedLang == "C" || selectedLang == "CPP"){
			editor.getSession().setMode("ace/mode/c_cpp");
		}
		else{
			editor.getSession().setMode("ace/mode/" + selectedLang.toLowerCase());
		}
		editor.session.getSelection().clearSelection();
	});

	//When changing the theme
	$("#theme").change(function(){
		themeSelected = $("#theme").val();
		if(themeSelected == "Light"){
			editor.setTheme("ace/theme/dawn");
		}
		else if(themeSelected == "Monokai"){
			editor.setTheme("ace/theme/monokai");
		}
		else if(themeSelected == "Solarised Light"){
			editor.setTheme("ace/theme/solarized_light");
		}
		else if(themeSelected == "Twilight"){
			editor.setTheme("ace/theme/twilight");
		}
	});

});