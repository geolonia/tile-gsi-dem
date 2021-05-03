# 地理院陰影タイル for MapboxGL JS

このリポジトリは、国土地理院の陰影タイルを Mapbox GL JS で利用可能な Mapbox Terrain-RGB 互換の標高タイルに変換するためのスクリプトです。

## 標高タイルについて

標高データには、国土地理院の DEM10B （10Mメッシュ）を使用しています。

https://fgd.gsi.go.jp/download/ref_dem.html

## ビルド方法

```
$ git clone git@github.com:geolonia/tile-gsi-dem.git
$ cd tile-gsi-dem.git
$ wget -i tilels-dem.csv -m # 約7時間
$ npm run build # 約1時間
$ mb-util tiles gsi-dem.mbtiles --image_format=png
```

* `wget` コマンドでダウンロードしたファイルは、`maps.gsi.go.jp` 以下に保存されます。このディレクトリを残しておくと、次回以降同じ内容のファイルはダウンロードされませんので、定期的にアップデートしたい場合は残すことをおすすめします。
