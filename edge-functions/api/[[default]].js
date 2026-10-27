# BCI EXPRESS - EdgeOne Pages-ல் Deploy செய்வது (PHP / MySQL தேவையில்லை)

இந்த package-ல் 2 கோப்புகள் மட்டுமே:

```
index.html                              <- முழு website (billing, B2B/B2C, wallet, users, Delhivery UI)
edge-functions/api/[[default]].js       <- server பகுதி (login, wallet, Razorpay, Delhivery, data)
```

ஏன் 2 கோப்புகள்? Razorpay Key Secret, Delhivery API Token, password சரிபார்ப்பு,
wallet balance ஆகியவை HTML-ல் இருந்தால் யார் வேண்டுமானாலும் page source-ல் பார்த்து
திருடலாம் / balance-ஐ மாற்றலாம். அதனால் இவை மட்டும் EdgeOne-ன் server function-ல் இருக்கும்.
Data (users, wallet, invoices) EdgeOne KV storage-ல் சேமிக்கப்படும் - எல்லா location-லும் ஒரே data.

## படி 1 - GitHub-ல் upload (எளிய வழி)
1. github.com-ல் ஒரு புதிய (Private) repository உருவாக்கவும்.
2. "Add file -> Upload files" -> `index.html` மற்றும் `edge-functions` folder-ஐ அப்படியே drag & drop செய்யவும்.
   (folder அமைப்பு மாறக்கூடாது: `edge-functions/api/[[default]].js`)
3. Commit செய்யவும்.

(மாற்று: EdgeOne Pages-ன் "Direct Upload"-ல் இதே folder-ஐ upload செய்து பார்க்கலாம்.
 deploy ஆன பிறகு `உங்கள்-site/api/auth.php?action=status` திறந்தால் JSON வரவில்லை என்றால்
 functions upload ஆகவில்லை - அப்போது GitHub வழியைப் பயன்படுத்தவும்.)

## படி 2 - EdgeOne Pages-ல் Project
1. EdgeOne Pages -> Create project -> Import Git repository -> உங்கள் repo.
2. Framework: Other / None. Build command: காலியாக. (Static project)
3. Deploy.

## படி 3 - KV storage bind செய்யவும் (மிக முக்கியம்)
1. Project -> KV Storage -> Apply/Create namespace.
2. Project-உடன் bind செய்யும்போது **Variable name = `bci_kv`** என்று சரியாக எழுதவும்.

## படி 4 - Environment Variables (Project Settings)
| பெயர் | மதிப்பு |
|---|---|
| `SESSION_SECRET` | நீளமான random எழுத்துகள் (40+). யாருக்கும் சொல்ல வேண்டாம் |
| `SETUP_KEY` | நீங்களே தேர்வு செய்யும் ரகசிய சொல் (முதல் admin உருவாக்க மட்டும்) |
| `RAZORPAY_KEY_ID` | **புதிதாக Regenerate செய்த** Razorpay Key ID |
| `RAZORPAY_KEY_SECRET` | **புதிதாக Regenerate செய்த** Key Secret |
| `DELHIVERY_TOKEN` | Delhivery API token (regenerate செய்தது) |
| `DELHIVERY_CLIENT` | Delhivery-ல் உங்கள் client/account பெயர் |
| `DELHIVERY_PICKUP` | Delhivery-ல் registered pickup/warehouse பெயர் |

Razorpay / Delhivery பின்னர் சேர்க்கலாம். SESSION_SECRET மற்றும் SETUP_KEY மட்டும் முதலில் வேண்டும்.
மாற்றிய பிறகு **Redeploy** செய்யவும்.

## படி 5 - முதல் Admin
1. உங்கள் site-ஐ திறந்தால் "First-time Setup" வரும்.
2. SETUP_KEY, உங்கள் Admin username/password (8+ எழுத்து) கொடுத்து உருவாக்கவும்.
   Default password எதுவும் இல்லை.
3. Admin -> Rate Master tab -> "Delhivery API" பெட்டியில் ✅/❌ நிலை தெரியும்.

## பயன்பாடு
- Vendors/Users: login page-ல் "Create Account" -> Admin "Vendors/Users" tab-ல் Approve/Reject.
- Wallet: vendor தாங்களே 💰 பொத்தான் -> Razorpay மூலம் recharge. Booking-ல் தொகை தானாக கழியும்.
  Razorpay இல்லாதபோது Admin "+ / -" மூலம் கைமுறை recharge.
- Margin (10-20%): Admin-க்கு மட்டும் தெரியும்; கணக்கீடு server-ல்.
- Delhivery: B2C Courier-ல் Delhivery partner தேர்ந்து invoice save -> "Auto Order Create" -> Label/Track.

## கட்டாயம் தெரிந்துகொள்ள வேண்டியவை
1. **Razorpay Live**: Razorpay Dashboard-ல் உங்கள் website domain-ஐ அனுமதிக்க வேண்டியிருக்கலாம்.
   முதலில் Test keys-ல் சோதிக்கவும்.
2. **KV 1 நிமிடம் தாமதம்**: ஒரு location-ல் செய்த மாற்றம் (Approve, wallet credit) மற்ற location-ல்
   அதிகபட்சம் ~60 வினாடி கழித்து தெரியலாம். Wallet குறியீடு credit திருடு போகாதபடி வடிவமைக்கப்பட்டுள்ளது;
   ஆனால் ஒரே நொடியில் வெவ்வேறு இடங்களிலிருந்து booking செய்தால் மிக அரிதாக balance-ஐ தாண்டி செலவாகலாம்.
3. Password மறந்தால்: Admin "Reset PW". Email மூலம் reset வசதி இல்லை.
4. பழைய PHP/Ezyro தரவு இங்கு மாறாது - இது புதிய system.
5. Delhivery "Auto Order Create" உங்கள் account-உடன் முதலில் ஒரு சோதனை order மூலம் சரிபார்க்கவும்.
