$replacements = @(
  @{Find = "�"; Replace = "é"},
  @{Find = "é propos"; Replace = "À propos"},
  @{Find = "é l'accueil"; Replace = "à l'accueil"},
  @{Find = "é l'"; Replace = "à l'"},
  @{Find = " é la "; Replace = " à la "},
  @{Find = "é partir"; Replace = "à partir"},
  @{Find = "é Angers"; Replace = "à Angers"},
  @{Find = "é vos"; Replace = "à vos"},
  @{Find = "é des"; Replace = "à des"},
  @{Find = "é apprendre"; Replace = "à apprendre"},
  @{Find = "é contribuer"; Replace = "à contribuer"},
  @{Find = "é traduire"; Replace = "à traduire"},
  @{Find = "é la page"; Replace = "à la page"},
  @{Find = "é la conception"; Replace = "à la conception"},
  @{Find = "aprés"; Replace = "après"},
  @{Find = "trés"; Replace = "très"},
  @{Find = "écrans clés"; Replace = "Écrans clés"},
  @{Find = "études de cas"; Replace = "Études de cas"},
  @{Find = "étude de cas"; Replace = "Étude de cas"},
  @{Find = "équipe"; Replace = "équipe"},
  @{Find = "équipe"; Replace = "équipe"},
  @{Find = "équipe"; Replace = "équipe"},
  @{Find = "équipe"; Replace = "équipe"},
  @{Find = "équipe"; Replace = "équipe"},
  @{Find = "équipe"; Replace = "équipe"},
  @{Find = "équipe"; Replace = "équipe"}
)

$files = Get-ChildItem -Path "C:\Users\cilro\Documents\UI designer\Portfolio\*.html"
foreach ($file in $files) {
  $text = Get-Content -Raw -Encoding UTF8 $file.FullName
  foreach ($r in $replacements) {
    $text = $text.Replace($r.Find, $r.Replace)
  }
  Set-Content -Path $file.FullName -Value $text -Encoding UTF8
}
