$apostrophe = [char]0x2019
$Eacute = [char]0x00C9
$eacute = [char]0x00E9
$VoirEtude = "Voir l" + $apostrophe + $Eacute + "tude de cas"
$VoirEtudeLower = "Voir l" + $apostrophe + $eacute + "tude de cas"
$VoirEcrans = "Voir les " + $Eacute + "crans"
$VoirEcransLower = "Voir les " + $eacute + "crans"

$files = Get-ChildItem -Path "C:\Users\cilro\Documents\UI designer\Portfolio\*.html"
foreach ($file in $files) {
  $text = Get-Content -Raw -Encoding UTF8 $file.FullName
  $text = $text.Replace($VoirEtude, $VoirEtudeLower)
  $text = $text.Replace($VoirEcrans, $VoirEcransLower)
  Set-Content -Path $file.FullName -Value $text -Encoding UTF8
}
