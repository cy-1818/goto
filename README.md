[for Japanese](https://github.com/cy-1818/goto/blob/main/WATASHIWOYOME.md)

goto is a programming language designed to be as **low** readability as possible. Descriptiveness may not be that low.

# Language specification
## Labels
```
"label":
```
is used as follows. label has no meaning without goto.
## goto
```
goto "label";
```
is used as follows. The name of the label is specified as a string, so variables can also be used.
## getto
```
getto input;
```
is used as follows. Get a line from standard input and assign it to the specified variable.
## goout
```
goout input;
```
Use as follows. It's standard output.
## when
```
goto "label" when a == b;
```
When used with goto, getto, or goout, it will be executed only when the condition is met, and when used with goto, it can be used as an if statement, branching, or exiting a loop. Therefore, **there is no such thing as if or while in this language.**
## define
Can be used in the same way as `#define` in C language. For those of you who want to obfuscate further.
## comment
Both *//* one-line comments and */* */* multi-line comments can be used. **Comments are deleted after the macro processing is finished.**
## Operators.
### +
Addition.
### **
Multiplication.
### -
Subtraction.
### /
Division.
### **
Power.
### %.
remainder to divide.
### !
Converts a string to a number, e.g. *str!*
### ?
Converts a number to a string, e.g. *num?*
### \#
Converts a number to a string, like str#num, which is the same as *str[num]* in C and other languages.
### == ! = < > <= >=
The equal sign, the inequality sign, and so on.
Please use + for disjunction and * for conjunction.

## Notes.
* Spaces are not allowed at the beginning of a line. Clean coding such as indentation is not allowed.
* A semicolon at the end of a line is required. Except for labels.

## How to execute
If your environment supports javascript, it basically works.

First, get the contents of goto_interpreter.js as a string and make it an object by eval. Then, override some functions such as getInput and printOutput to suit your environment, and pass the program written in goto to the main function as a string to execute it.

If you want to try it anyway, click [this](https://cy-1818.github.io/goto/)!

Special thanks : [DeepL translation](https://www.deepl.com/app/?utm_source=ios&utm_medium=app&utm_campaign=share-translation)
