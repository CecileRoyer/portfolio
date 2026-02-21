$Eacute = [char]0x00C9
$eacute = [char]0x00E9
$EacuteWord = "Voir l" + $Eacute + "tude de cas"
$eacuteWord = "Voir l" + $eacute + "tude de cas"
$EcouteLower = "<h3>" + [char]0x00E9 + "coute active</h3>"
$EcouteUpper = "<h3>" + [char]0x00C9 + "coute active</h3>"

$files = Get-ChildItem -Path "C:\Users\cilro\Documents\UI designer\Portfolio\*.html"
foreach ($file in $files) {
  $text = Get-Content -Raw -Encoding UTF8 $file.FullName
  $text = $text.Replace($EacuteWord, $eacuteWord)
  $text = $text.Replace($EcouteLower, $EcouteUpper)
  Set-Content -Path $file.FullName -Value $text -Encoding UTF8
}
