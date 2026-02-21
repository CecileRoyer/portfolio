$replacements = @{
  "En-téte" = "En-tête"
  "conéois" = "conçois"
  "oé" = "où"
  "é la" = "à la"
  "é l'" = "à l'"
  "é votre" = "à votre"
  "é vos" = "à vos"
  "é des" = "à des"
  "contribuer é" = "contribuer à"
  "maniére" = "manière"
  "particuliérement" = "particulièrement"
  "aperéus" = "aperçus"
  "au cour" = "au cœur"
  "M'écrire" = "M’écrire"
  "l'Étude" = "l’étude"
  "Étude de cas" = "Étude de cas"
  "Voir l’étude de cas" = "Voir l’étude de cas"
}

$files = Get-ChildItem -Path "C:\Users\cilro\Documents\UI designer\Portfolio\*.html"
foreach ($file in $files) {
  $text = Get-Content -Raw -Encoding UTF8 $file.FullName
  foreach ($k in $replacements.Keys) {
    $text = $text.Replace($k, $replacements[$k])
  }
  Set-Content -Path $file.FullName -Value $text -Encoding UTF8
}
