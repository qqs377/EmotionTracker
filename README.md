# EmotionTracker

1. Started the emotion tracker word cloud

2. scaled the word cloud endless time and when the count goes high, the word disappear from the screen (i.e. overflow) -> unsolved

3. when access the web using mobile device, the emoji icon is out of screen -> make emoji icon auto-scale based on screen size

5. Want it to support multi-user -> built a backend with Render

6. Free Render shut down after inactivity, all saved data lost upon restart -> connect Render to a SQL database to store the information

7. Render's free PostgreSQL expire after a month -> switched to Supabase SQL

8. Supabase cool down after inactivity (7 days) -> (a). have a code that runs every 12 hours to remove old entries from SQL database to prevent running out of the storage. (b). alternatively, can setup an automated script to regularly ping the database

9. A lot of formatting issues, wordCloud.js does not read the count from Supabase directly (can read Render's), has to reformat

10. Want the user be able to distinguish their inputs from other users' inputs -> set up "global emotion" section and "my emotion" section separately. "Global emotion" data is directly achieved from Supabase SQL db, display persists even when Render is shut down due to inactivity. "My emotion" data is saved and retrieved locally, will lose if user cleans the cashe/cookie

11. Trying to make the emotion logs show entries at descending order, sorting is added to both, works in "global emotion" but not "my emotion". observed that entries in "my emotion" is displayed in descending order only after refreshing the page, click on emotion icon to add new emotion will cause all entries under "my emotion" to go back to ascending order -> changed append to prepend works

12. tried with mobile phone, the #11 descending problem in "my emotion" persists, seems that phone device somehow interpret the sort function differently -> ??? I never know why. unsolved
