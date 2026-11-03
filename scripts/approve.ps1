param([Parameter(Mandatory=$true)][string]$Manifest,[Parameter(Mandatory=$true)][string]$Site)
$data=Get-Content $Manifest -Raw | ConvertFrom-Json
foreach($item in $data){if($item.siteId -eq $Site -and $item.status -eq "DRAFT"){$item.status="APPROVED"}}
$data | ConvertTo-Json -Depth 20 | Set-Content $Manifest
Write-Host "Approved draft items for $Site in $Manifest"
