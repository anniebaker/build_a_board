# SETUP
1. Start database (this will likely already be running - port 5432)
brew services run postgresql
psql -d chez_mingus_db -U aknee

2. Start express server (port 3001)
cd backend
node index.js

3. Start vite react app (port 5173)
cd groceryHelperApp
npm run dev

It'll be working!

# WANTS
## Technical stuff
- Create an automatic type creation & update system for typescript interfaces v. postgresql schema (prisma?)
- Keep everything nice n clean
- Supabase - potential cheap/free postgres hosting, digital ocean ~$5/mo
AI recipe generator
AI meal planner helper

## USER stuff
Reorder recipes and assign to days
Drag n drop

## Database steps
1. DONE Create selected table
2. Create ingredients table
3. Create recipe_ingredients table



