import {test,expect} from '@playwright/test';
import {ingredients,recipes,measurement,matchesRecipe,drinkColor} from '../src/drinks.js';

test('expanded menu has complete, correctly measured recipes',()=>{
 expect(recipes).toHaveLength(17);
 expect(ingredients).toHaveLength(17);
 expect(new Set(recipes.map(r=>r.name)).size).toBe(recipes.length);
 for(const recipe of recipes){
  expect(['Rocks','Coupe']).toContain(recipe.glass);
  expect(['Stir','Shake']).toContain(recipe.method);
  expect(new Set(recipe.items).size).toBe(recipe.items.length);
  const pours=recipe.items.map(id=>({id,amount:measurement(recipe,id)}));
  expect(matchesRecipe(pours,recipe)).toBe(true);
  expect(matchesRecipe([...pours,pours[0]],recipe)).toBe(false);
  expect(matchesRecipe(pours.slice(1),recipe)).toBe(false);
  expect(matchesRecipe(pours.map((p,i)=>i===0?{...p,amount:'99 oz'}:p),recipe)).toBe(false);
  for(const id of recipe.items){expect(ingredients[id]).toBeDefined();expect(recipe.amounts[id]).toBeTruthy()}
 }
 const negroni=recipes.find(r=>r.name==='Negroni');
 expect(measurement(negroni,1)).toBe('1 oz');
 expect(matchesRecipe([{id:1,amount:'2 oz'},{id:2,amount:'1 oz'},{id:5,amount:'1 oz'}],negroni)).toBe(false);
 expect(drinkColor([6,13,15])).not.toBe(drinkColor([6,9,12,11]));
});
