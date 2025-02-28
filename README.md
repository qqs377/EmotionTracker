# EmotionTracker

1. Started the emotion tracker word cloud

2. scaled the word cloud endless time and when the count goes high, the word disappear from the screen (i.e. overflow) -> unsolved

3. when access the web using mobile device, the emoji icon is out of screen -> make emoji icon auto-scale based on screen size

5. Want it to support multi-user -> built a backend with Render

6. Free Render shut down after inactivity, all saved data lost upon restart -> connect Render to a SQL database to store the information

7. Render's free PostgreSQL expire after a month -> switched to Supabase SQL

8. Supabase cool down after inactivity (7 days) -> (a). have a code that runs every 12 hours to remove old entries from SQL database to prevent running out of the storage. (b). alternatively, can setup an automated script to regularly ping the database

9. ...
