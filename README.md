# UNID - Unique ID Generator

**UNID**はブラウザ向けに開発されたユニークID生成ライブラリです。このライブラリは、高速かつ短いIDを生成し、IDをデコードして生成時のタイムスタンプを取得することが可能です。\
これは自分用に作成したもので、あまりテストしていません。そのため、バグがある可能性があります。

## 特徴

- **タイムスタンプベース**: タイムスタンプを使用してIDを生成するため、IDのデコードが可能
- **カウンター**: カウンターを使用しているため同じタイムスタンプでも順序を保つことが可能
- **高速**: 1秒間に平均130万件のIDを生成・デコード可能
- **短い**: 9文字で生成可能
- **低い衝突リスク**: 同一のタイムスタンプで複数回生成しても衝突することはない

## 他のID生成ライブラリとの比較

| 特徴 | UNID | UUID | ULID | CUID | NanoID |
| - | - | - | - | - | - |
| 長さ | 9文字 | 36文字 | 26文字 | 25文字 | 21文字(デフォルト) |
| デコード | 可能 | 不可能 | 可能 | 可能 | 不可能 |
| ユニーク性 | 時間<br>+カウンター<br>+ランダム | ランダム | 時間<br>+ランダム | 時間<br>+カウンター<br>+クライアント識別子<br>+ランダム | ランダム |
| セキュア | いいえ | はい | 部分的 | 部分的 | はい |
| ファイルサイズ | 1.67KB | 1.33KB | 2.31KB | 1.97KB | 197Bytes |
| NodeJS対応 | いいえ | はい | はい | はい | はい |

## インポート

HTMLファイルのheadタグ直下に以下を追加します。

```html
<script src="https://cdn.jsdelivr.net/gh/yppmeat/unid-generator@b1eebacd48e7b9478812056abcdeaccf9d1c3f53/dist/unid.min.js"></script>
```

## 使い方

```js
// ユニークIDを生成
const id = UNID.generateID();
console.log(id);

// IDをデコードして、タイムスタンプとカウンターを取得
const { timestamp, index } = UNID.decodeID(id);
console.log(timestamp, index);
```

1. ID生成:
  - `UNID.generateID()`を使用します。
  - 返される値は9文字の文字列です。
2. IDデコード:
  - `UNID.decodeID(id)`を使用します。
  - 返される値はオブジェクトで、`timestamp`と`index`(カウンター)を持ちます。

## テスト用ページ

- [速度確認テスト](https://yppmeat.github.io/unid-generator/public/test/)
- [動作確認テスト](https://yppmeat.github.io/unid-generator/public/generate/)