$files = Get-ChildItem -Path "C:\Users\cilro\Documents\UI designer\Portfolio\*.html"
foreach ($file in $files) {
  $text = Get-Content -Raw -Encoding UTF8 $file.FullName
  $text = $text.Replace('accés','accès')
  $text = $text.Replace(' é différentes',' à différentes')
  $text = $text.Replace('grâce é','grâce à')
  Set-Content -Path $file.FullName -Value $text -Encoding UTF8
}
