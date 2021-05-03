# 地理院陰影タイル for MapboxGL JS

このリポジトリは、国土地理院の陰影タイルを Mapbox GL JS で利用可能な Mapbox Terrain-RGB 互換の標高タイルに変換するためのスクリプトです。

## 標高タイルについて

標高データには、国土地理院の DEM10B （10Mメッシュ）を使用しています。

https://fgd.gsi.go.jp/download/ref_dem.html

## ビルド方法

タイルは、`mokuroku-dem10b.csv` を元に差分のみがビルドされます。
はじめてタイルをビルドする際には、`mokuroku-dem10b.csv` を削除してください。

```
$ git clone git@github.com:geolonia/tile-gsi-dem.git
$ cd tile-gsi-dem.git
$ npm run build
$ mb-util tiles gsi-dem.mbtiles --image_format=png
```

タイルのビルドが完了すると、`mokuroku-dem10b.csv` が最新の状態にアップデートされますので、動作確認後にコミットしておくと次回以降その差分のタイルだけがビルドされます。

## 参考

* https://qiita.com/hfu/items/915d7fb961d05670cab2 by @hfu
* https://github.com/gsi-cyberjapan/mokuroku-spec
