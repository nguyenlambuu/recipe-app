import {Component} from '@angular/core';
import {NgForm} from "@angular/forms";

import {ShoppingListService} from "../../services/shopping-list";
import {Ingredient} from "../../models/ingredient";

@Component({
    selector: 'page-shopping-list',
    templateUrl: 'shopping-list.html',
})
export class ShoppingListPage {
    ingredients: Ingredient[];

    constructor(private slService: ShoppingListService) {
    }

    ionViewWillEnter() {
        this.loadItems();
    }

    onAddItem(form: NgForm) {
        this.slService.addItem(form.value.ingredientName, form.value.amount);
        form.reset();
        this.loadItems();
    }

    onRemoveFromIngredients(index: number) {
        this.ingredients = this.slService.removeItem(index);
        this.loadItems();
    }

    private loadItems() {
        this.ingredients = this.slService.getItems();
    }
}



