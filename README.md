# Gentle Companion

Create a new project with AI enabled., Create a React Native mobile app UI/UX for "App Name" - a dementia care application.

AESTHETIC:

- Login/Sign-up screens: Use the provided image (purple/blue gradient with clouds, columns, starlight, dreamy vibes)

- Inside app screens: Light purple background (#F3E6FF or #EDE9FF)

- Color palette: Warm purples, soft blues, gentle pinks, white accents

- Typography: Large, readable fonts (min 16px) - accessibility for elderly users

- Components: Soft rounded corners, subtle shadows, no harsh edges

- Overall tone: Calm, comforting, not clinical

AUTH SCREENS (with dreamy background image):

1. Login Page:

   - Email/Phone input field

   - Password field

   - "Forgot Password?" link

   - Login button (warm purple/gold)

   - "Sign Up" toggle

   - Dropdown: "I am a Patient" / "I am a Caregiver"

2. Sign-Up Page:

   - Name, Email, Password fields

   - Role selection (Patient/Caregiver)

   - If Caregiver: Add patient name/ID field

   - Terms & Privacy checkbox

   - Sign Up button

---

PATIENT DASHBOARD (Light purple background):

- Top bar: Patient name, greeting ("Good Morning, [Name]")

- Date display

- 4 main navigation cards/tabs:

  1. **Games** (icon: game controller)

  2. **Journal** (icon: notebook/camera)

  3. **Reminders** (icon: bell)

  4. **Progress** (icon: chart)

Dashboard cards showing:

- Last game played + score

- Recent memory journal entry (thumbnail + date)

- Next reminder time

- Weekly cognitive score trend

---

GAMES SCREEN:

Two game cards:

1. **Pattern Memory Game**

   - Title: "Memory Match"

   - Description: "Watch & remember the sequence"

   - Difficulty badge: "Level 1/5"

   - Large "Play" button

   - Recent score display

2. **Grid Sequence Game**

   - Title: "Sequence Master"

   - Description: "Repeat the pattern"

   - Difficulty badge: "Level 1/5"

   - Large "Play" button

   - Recent score display

GAME PLAY SCREEN (Pattern Memory):

- Back button (top left)

- Title: "Memory Match - Level X"

- Objects display area (center) - shows mango, banana, etc. for 5 seconds

- Message: "Watch and remember..."

- After display: "Now choose the sequence"

- 4 choice buttons arranged in grid

- Score display at bottom

GAME PLAY SCREEN (Grid Sequence):

- Back button (top left)

- Title: "Sequence Master - Level X"

- Grid of colored boxes (3x3 or 4x4 depending on difficulty)

- Instructions: "Watch the pattern, then repeat"

- Animation showing sequence

- Message: "Your turn! Tap the sequence"

- Boxes respond to taps with color flash

- Result: "Correct!" / "Try Again"

- Next Level / Retry buttons

- Score accumulated

---

JOURNAL SCREEN:

- Header: "My Memories"

- Button: "+ New Memory" (prominent, warm color)

- List of past entries:

  - Each entry card shows: Thumbnail image, date, event description (first 20 words)

  - Tap to view full memory

NEW MEMORY CAPTURE:

- Camera button (large center button)

- After photo: 

  - "What happened?" text input

  - "Who was there?" (multi-select/input)

  - "When did this happen?" (date picker)

  - "Where were you?" (location input)

  - Save button

MEMORY DETAIL VIEW:

- Photo (full width)

- Event description

- Metadata (who, when, where)

- Tab: "Quiz About This Memory"

- Quiz section:

  - AI-generated questions from the memory

  - Multiple choice or text input

  - Score display

  - Sentiment mood display (happy/neutral/sad emoji with text)

---

REMINDERS SCREEN:

- Header: "Daily Reminders"

- Toggle: "Reminders On/Off"

- List of reminders:

  - Time | Reminder text | Checkbox

  - Examples: "Take medication", "Call daughter", "Drink water"

- Button: "+ Add Reminder"

---

CAREGIVER DASHBOARD:

- Patient name selector (if multiple)

- 4 metric cards:

  1. **Cognitive Score** (weekly trend graph)

  2. **Games Played** (this week count)

  3. **Memories Added** (this month count)

  4. **Mood Trend** (sentiment analysis graph)

- Sections:

  - Recent Memories (with sentiment)

  - Game Performance Breakdown

  - Activity Timeline

- Settings button (gear icon)

---

GENERAL UI ELEMENTS:

- Bottom navigation bar (5 icons): Home, Games, Journal, Reminders, Profile

- Soft drop shadows on cards

- Subtle animations on button press

- Large, easy-to-tap buttons (min 50px height)

- Icons: Simple, recognizable, colorful

- Loading states: Gentle spinner/animation

- Success/Error toasts: Soft notifications

COLOR PALETTE:

- Primary: #8B7FC9 (soft purple)

- Secondary: #E8B4F1 (light pink)

- Accent: #FFD700 (warm gold for buttons)

- Background: #F3E6FF (light lavender)

- Text: #2D1B4E (dark purple - readable)

- Success: #A8E6CF (soft green)

- Danger: #FF8B94 (soft red)

TYPOGRAPHY:

- Headings: 24px, Bold, Dark Purple

- Subheadings: 18px, Semi-bold

- Body text: 16px, Regular

- Small text: 14px

- Font: System font (San Francisco / Roboto) - clean & readable

ACCESSIBILITY:

- High contrast text

- Large tap targets

- Simple navigation

- Clear CTAs

- No flashing animations

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/dbb960bb-e823-4f13-af58-efa700fa18d9).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
