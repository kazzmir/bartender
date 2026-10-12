// Each click dispenses the selected order's measured amount of an ingredient.
export const ingredients = [
 {name:'Bourbon',detail:'Rich & oaky',color:'#775022',unit:'2 oz',category:'Spirits'},
 {name:'Gin',detail:'Bright & botanical',color:'#83917b',unit:'2 oz',category:'Spirits'},
 {name:'Vermouth',detail:'Sweet & aromatic',color:'#3b5d42',unit:'1 oz',category:'Modifiers'},
 {name:'Bitters',detail:'A little complexity',color:'#894021',unit:'2 dashes',category:'Modifiers'},
 {name:'Simple syrup',detail:'The sweet spot',color:'#a58d4b',unit:'¼ oz',category:'Modifiers'},
 {name:'Campari',detail:'Bold & bittersweet',color:'#8a3330',unit:'1 oz',category:'Modifiers'},
 {name:'Vodka',detail:'Clean & smooth',color:'#9daaa1',unit:'2 oz',category:'Spirits'},
 {name:'White rum',detail:'Light & mellow',color:'#b9a971',unit:'2 oz',category:'Spirits'},
 {name:'Tequila',detail:'Agave & sunshine',color:'#9b7d3e',unit:'2 oz',category:'Spirits'},
 {name:'Triple sec',detail:'Orange liqueur',color:'#a87c35',unit:'1 oz',category:'Modifiers'},
 {name:'Lemon juice',detail:'Fresh & tart',color:'#c8b849',unit:'¾ oz',category:'Mixers'},
 {name:'Lime juice',detail:'A bright squeeze',color:'#7d9c48',unit:'¾ oz',category:'Mixers'},
 {name:'Cranberry juice',detail:'Ruby & refreshing',color:'#a54153',unit:'1 oz',category:'Mixers'},
 {name:'Coffee liqueur',detail:'Roasted & rich',color:'#62402c',unit:'1 oz',category:'Modifiers'},
 {name:'Espresso',detail:'Freshly pulled',color:'#473024',unit:'1 oz',category:'Mixers'},
 {name:'Cream',detail:'Soft & silky',color:'#c9c3a7',unit:'1 oz',category:'Mixers'},
 {name:'Honey syrup',detail:'Golden sweetness',color:'#b88c35',unit:'¾ oz',category:'Modifiers'},
];
function drink(name,sub,items,amounts,method,glass,customer,quote){
 return {name,sub,items,amounts:Object.fromEntries(items.map((id,i)=>[id,amounts[i]])),method,glass,customer,quote};
}
export const recipes = [
 drink('Old Fashioned','A classic. For a reason.',[0,3,4],['2 oz','2 dashes','¼ oz'],'Stir','Rocks','JAMES','“An Old Fashioned, please.<br>It’s been that kind of day.”'),
 drink('Negroni','Bitter. Sweet. Beautiful.',[1,2,5],['1 oz','1 oz','1 oz'],'Stir','Rocks','SOFIA','“A Negroni for me.<br>Something with a little bite.”'),
 drink('Manhattan','A little New York, after dark.',[0,2,3],['2 oz','1 oz','2 dashes'],'Stir','Coupe','MILES','“One Manhattan, please.<br>Make it a good one.”'),
 drink('Gin Old Fashioned','A fresh take on an old friend.',[1,3,4],['2 oz','2 dashes','¼ oz'],'Stir','Rocks','OLIVIA','“Try a Gin Old Fashioned?<br>I’m feeling adventurous.”'),
 drink('Shaken Martini','Ice cold. Unapologetically smooth.',[1,2],['2½ oz','½ oz'],'Shake','Coupe','ALEX','“A gin Martini, please.<br>Shaken, not stirred.”'),
 drink('Whiskey Sour','A little sweet. A little sour.',[0,10,4],['2 oz','¾ oz','¾ oz'],'Shake','Coupe','CHARLIE','“A Whiskey Sour, please.<br>Skip the egg white.”'),
 drink('Margarita','Agave, citrus, and a good time.',[8,9,11],['2 oz','1 oz','1 oz'],'Shake','Rocks','ISABEL','“One Margarita.<br>Fresh lime makes the difference.”'),
 drink('Daiquiri','Three ingredients. Island perfection.',[7,11,4],['2 oz','1 oz','¾ oz'],'Shake','Coupe','LEO','“A classic Daiquiri.<br>No blender needed.”'),
 drink('Cosmopolitan','A little pink. A little playful.',[6,9,12,11],['1½ oz','½ oz','1 oz','½ oz'],'Shake','Coupe','RUBY','“A Cosmopolitan for me.<br>It’s a night out.”'),
 drink('Lemon Drop','Bright citrus, a sweet finish.',[6,9,10,4],['2 oz','½ oz','¾ oz','½ oz'],'Shake','Coupe','EMMA','“Can I get a Lemon Drop?<br>Something bright.”'),
 drink('White Russian','A smooth, creamy nightcap.',[6,13,15],['2 oz','1 oz','1 oz'],'Stir','Rocks','MAX','“A White Russian.<br>Nice and easy.”'),
 drink('Espresso Martini','A little pick-me-up after dark.',[6,13,14,4],['2 oz','½ oz','1 oz','¼ oz'],'Shake','Coupe','ZOE','“Espresso Martini, please.<br>The night is still young.”'),
 drink('Boulevardier','The Negroni’s warmer cousin.',[0,2,5],['1½ oz','1 oz','1 oz'],'Stir','Rocks','BEN','“A Boulevardier.<br>I’m in the mood for bourbon.”'),
 drink('Gold Rush','Bourbon with a golden touch.',[0,10,16],['2 oz','¾ oz','¾ oz'],'Shake','Rocks','NORA','“One Gold Rush, please.<br>I love that honey finish.”'),
 drink('Bee’s Knees','Gin, lemon, and liquid sunshine.',[1,10,16],['2 oz','¾ oz','¾ oz'],'Shake','Coupe','THEO','“The Bee’s Knees.<br>Just like the name says.”'),
 drink('Gimlet','Crisp, simple, and lime-bright.',[1,11,4],['2 oz','¾ oz','¾ oz'],'Shake','Coupe','AVA','“A fresh lime Gimlet.<br>Keep it crisp.”'),
 drink('Tequila Old Fashioned','An agave twist on the original.',[8,3,4],['2 oz','2 dashes','¼ oz'],'Stir','Rocks','JACK','“Tequila Old Fashioned?<br>Let’s change things up.”'),
];
export function drinkColor(ids){
 if(ids.includes(15))return '#e6d5b7';
 if(ids.includes(14)||ids.includes(13))return '#75412a';
 if(ids.includes(12))return '#c45c79';
 if(ids.includes(5))return '#ca5934';
 if(ids.includes(0))return '#bc7d2f';
 if(ids.includes(16)||ids.includes(10))return '#d5b65e';
 if(ids.includes(11))return '#b8c88b';
 return '#d4d9b4';
}
export function measurement(recipe,id){return recipe.amounts[id]||ingredients[id].unit;}
export function matchesRecipe(pours,recipe){
 return pours.length===recipe.items.length&&recipe.items.every(id=>pours.filter(p=>p.id===id&&p.amount===measurement(recipe,id)).length===1);
}
