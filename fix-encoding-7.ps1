$files = Get-ChildItem -Path "C:\Users\cilro\Documents\UI designer\Portfolio\*.html"
foreach ($file in $files) {
  $text = Get-Content -Raw -Encoding UTF8 $file.FullName
  $text = $text.Replace('>?</a>', '>↑</a>')
  $text = $text.Replace('<span class="project-nav__chevron"><</span>', '<span class="project-nav__chevron">‹</span>')
  $text = $text.Replace('<span class="project-nav__chevron">></span>', '<span class="project-nav__chevron">›</span>')
  Set-Content -Path $file.FullName -Value $text -Encoding UTF8
}
