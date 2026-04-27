#!/usr/bin/env pwsh

# ================================
# Test Script: Create API Key Flow
# ================================

$BaseUrl = "http://localhost:3002"
$CookieJar = "$PSScriptRoot/cookies.json"

Write-Host "🔐 Step 1: Login first" -ForegroundColor Cyan

# ตั้งค่า credentials
$email = "test@example.com"
$password = "password123"

try {
    # 1. Login
    $loginResponse = Invoke-WebRequest -Uri "$BaseUrl/api/auth/login" `
        -Method POST `
        -ContentType "application/json" `
        -Body (ConvertTo-Json @{ email = $email; password = $password }) `
        -UseBasicParsing

    Write-Host "✅ Login successful!" -ForegroundColor Green
    $loginData = $loginResponse.Content | ConvertFrom-Json
    Write-Host "User: $($loginData.user.firstName) $($loginData.user.lastName)" -ForegroundColor Green

    # 2. Extract cookies
    $cookies = $loginResponse.Headers.'Set-Cookie'
    Write-Host "✅ Got cookies: $($cookies.Count) cookie(s)" -ForegroundColor Green

    # 3. Create API Key
    Write-Host "`n📝 Step 2: Create API Key" -ForegroundColor Cyan

    $keyName = "test-key-$(Get-Random)"
    
    $createResponse = Invoke-WebRequest -Uri "$BaseUrl/api/keys" `
        -Method POST `
        -ContentType "application/json" `
        -Body (ConvertTo-Json @{ name = $keyName }) `
        -Headers @{ Cookie = $cookies } `
        -UseBasicParsing

    Write-Host "✅ API Key created successfully!" -ForegroundColor Green
    $keyData = $createResponse.Content | ConvertFrom-Json
    
    Write-Host "`n🔑 API Key Details:" -ForegroundColor Yellow
    Write-Host "  Name: $($keyData.apiKey.name)" -ForegroundColor White
    Write-Host "  Key: $($keyData.apiKey.key)" -ForegroundColor White
    Write-Host "  Created: $($keyData.apiKey.createdAt)" -ForegroundColor White
    Write-Host "  Active: $($keyData.apiKey.isActive)" -ForegroundColor White

    # 4. Get all API Keys
    Write-Host "`n📋 Step 3: List all API Keys" -ForegroundColor Cyan

    $listResponse = Invoke-WebRequest -Uri "$BaseUrl/api/keys" `
        -Method GET `
        -Headers @{ Cookie = $cookies } `
        -UseBasicParsing

    $listData = $listResponse.Content | ConvertFrom-Json
    Write-Host "✅ Found $($listData.apiKeys.Count) API Key(s)" -ForegroundColor Green
    
    foreach ($key in $listData.apiKeys) {
        Write-Host "  - $($key.name): $($key.key) [Active: $($key.isActive)]" -ForegroundColor White
    }

} catch {
    Write-Host "❌ Error: $_" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}
