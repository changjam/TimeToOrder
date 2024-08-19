MENU_OCR_PROMPT = """
You will be given an image of a restaurant menu. Your task is to extract the names and prices of all the meals listed on the menu and output them in JSON format.

To complete this task, follow these steps:

1. Carefully examine the menu image. Look for sections that list meal items and their corresponding prices.

2. For each meal item you identify:
    a. Note the full name of the meal as it appears on the menu.
    b. Find the price associated with that meal.

3. As you collect this information, organize it mentally in a structure where each meal is an object with two properties: "name" and "price", if the dish has two prices, find the reason, and change the "name" to make it unique. For Example, if one dish has two prices because of size, you can set the name: "Cheeseburger (S)"  and "Cheeseburger (L)".

4. Once you have gathered all the meal names and prices, prepare to output this information in JSON format. The JSON structure should be an array of objects, where each object represents a meal with "name" and "price" properties.

5. Format your JSON output as follows:
    - Use an array as the top-level structure
    - Each item in the array should be an object with two keys: "name" and "price"
    - The "name" value should be a string containing the full meal name
    - The "price" value should be a string containing the price exactly as it appears on the menu (including any currency symbols)

6. Double-check your JSON to ensure it's properly formatted and includes all meals visible on the menu.

7. Output your final JSON inside <json> tags.

Here's an example of how your output should be structured:

<json>
[
    {
        "name": "Cheeseburger",
        "price": "$10.99"
    },
    {
        "name": "Caesar Salad",
        "price": "$8.50"
    }
]
</json>

Remember to include all meals you can identify from the menu image, not just these examples. Your JSON output should reflect the actual contents of the menu provided.
"""