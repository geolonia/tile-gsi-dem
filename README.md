# 地理院標高タイル for MapboxGL JS

![](https://repository-images.githubusercontent.com/363929074/0d08f800-ad07-11eb-9e3a-5771e1e58c14)

このリポジトリは、国土地理院の標高タイルを Mapbox GL JS で利用可能な Mapbox Terrain-RGB 互換の標高タイルに変換するためのスクリプトです。

## 標高タイルについて

標高データには、国土地理院の DEM10B （10Mメッシュ）を使用しています。

https://fgd.gsi.go.jp/download/ref_dem.html

## ビルド方法

```
$ git clone git@github.com:geolonia/tile-gsi-dem.git
$ cd tile-gsi-dem
$ npm run build
```

* タイルのビルドを開始すると `.mokuroku.log` というファイルに、ビルドが終了したタイルのログが1行ずつ追加されます。
* すべてのタイルのビルドが完了すると、`mokuroku.csv` というファイルが作成され、上述のログは削除されます。
* `mokuroku.csv` がある場合は、`mokuroku.csv` を使用して差分のみ更新されます。

## 参考

* https://qiita.com/hfu/items/915d7fb961d05670cab2 by @hfu
* https://github.com/gsi-cyberjapan/mokuroku-spec

## ライセンス

* MIT

このリポジトリに含まれるソースコードのライセンスは MIT としますが、成果物のタイルをご利用になる場合は、測量法第２９条（複製）、第３０条（使用）に基づき国土地理院長への承認申請が必要になる可能性がありますので、ご注意ください。

https://www.gsi.go.jp/LAW/2930-index.html
