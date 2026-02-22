# Information

For this part of the course, submit all files relating to the country data application, except the `node_modules` directory.

---

## Exercise 2.18* (Data for countries, Step 1)

* Fetch country data from the REST API at [https://studies.cs.helsinki.fi/restcountries/](https://studies.cs.helsinki.fi/restcountries/).
* The data is provided in **machine-readable format** via a RESTful API.
* Implement a simple interface where the user can search for countries by name.
* If more than 10 countries match the query, show a message asking the user to make the query more specific.
* If 2–10 countries match, show all matching countries in a list.
* If exactly 1 country matches, show detailed information:

  * Name, capital, area
  * Flag
  * Languages spoken
* NB: It is enough that the application works for most countries. Edge cases such as Sudan/South Sudan can be ignored.

---

## Exercise 2.19* (Data for countries, Step 2)

* Improve the application from Step 1.
* Next to each country in the list (if there are multiple matches), add a **“show” button**.
* Pressing the button shows the detailed view for that country (same as single-country view in Step 1).
* NB: Ignore edge cases where a country name is part of another country’s name.

---

## Exercise 2.20* (Data for countries, Step 3)

* Extend the single-country view to show **weather information for the capital**.
* You can use services such as [OpenWeatherMap](https://openweathermap.org) (API key required).
* NB:

  * In some browsers (Firefox), HTTP requests may fail due to HTTPS enforcement. Chrome is recommended.
  * **Do not save the API key in source control**. Use an **environment variable** instead.
  * Prefix the variable with `VITE_` to make it available in Vite:

```bash
# Linux/macOS Bash
export VITE_WEATHER_API_KEY=your_api_key_here && npm run dev

# Windows PowerShell
($env:VITE_WEATHER_API_KEY="your_api_key_here") -and (npm run dev)

# Windows cmd.exe
set "VITE_WEATHER_API_KEY=your_api_key_here" && npm run dev
```

* Access the key in code via:

```js
const api_key = import.meta.env.VITE_WEATHER_API_KEY
```

* Restart the dev server after changing environment variables.
* Display weather info for the country’s capital, including temperature, wind, and weather icon.

---

**This was the last exercise of this part of the course.**
Push your code to GitHub and mark all finished exercises in the exercise submission system.
