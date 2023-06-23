gotoは、出来るだけ可読性が**低く**なるように作られたプログラミング言語です。記述性は意外とそこまで低くないかも。

# 言語仕様
## ラベル
```
"label":
```
というように設定します。単独では何の意味もありません。
## goto
```
goto "label";
```
というように使用します。ラベルの名前は文字列で指定するので、変数も使用可能です。
## getto
```
getto input;
```
というように使用します。標準入力から1行取得して指定された変数に代入します。
## goout
```
goout input;
```
というように使用します。標準出力です。
## when
```
goto "label" when a == b;
```
というように使用します。goto、getto、gooutの後ろにつけると、条件に合う時のみ実行されるようになります。gotoと合わせて使うことでif文のような分岐やループから抜けるなどの処理が可能です。なので、**この言語にifやwhileなどは存在しません。**
## define
C言語の`#define`と同じように使用できます。さらに難読化を進めたいあなたに。
## コメント
//の1行コメントと/* */の複数行コメントの両方が使用可能です。**マクロの処理の終了後にコメントは削除されます。**
## 演算子
### +
足し算です。
### *
掛け算です。
### -
引き算です。
### /
割り算です。
### **
累乗です。
### %
割る余り、です。
### !
文字列を数値に変換します。str!というように使います。
### ？
数値を文字列に変換します。num?というように使います。
### #
str#num、とするとC言語などでいうstr[num]と同じことができます。
### == != < > <= >=
等号、不等号などです。
なお、論理和は+、論理積は*をご利用ください。

## 注意点
* 行の初めにスペースはいれれません。インデントみたいな綺麗なコーディングは許しません。
* 行終わりのセミコロンは必須です。ただしラベルを除く。
