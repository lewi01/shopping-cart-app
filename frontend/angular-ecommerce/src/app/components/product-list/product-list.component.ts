
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  
  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  searchMode:boolean = false;

  //pagination
  thePageNumber: number = 1;
  thePageSize: number = 5;
  theTotalElements: number = 0;

  previousKeyword: string | null = null;

  constructor(private productService : ProductService,
              private cartService: CartService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(()=>{
    this.listProducts();
    }
    );
  }

  listProducts(){

    this.searchMode = this.route.snapshot.paramMap.has('keyword');
    if(this.searchMode){
      this.handleSearchProducts();
    }
    else{
    this.handleListProducts();
    }
    
  }
  handleSearchProducts(){

    const theKeyword: string  = this.route.snapshot.paramMap.get('keyword') as string;

      //pagination
      if(this.previousKeyword != theKeyword){
        this.thePageNumber =1;
      }

      this.previousKeyword = theKeyword
      console.log('keyword= '+ theKeyword,
                  'thePageNumber= '+ this.thePageNumber);

    this.productService.searchProductPaginate(this.thePageNumber-1,
                                              this.thePageSize,
                                              theKeyword).subscribe(data =>{
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number+1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    });
  }

  handleListProducts(){

    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if(hasCategoryId){
      this.currentCategoryId = Number(this.route.snapshot.paramMap.get('id'));
    }else{
      this.currentCategoryId=1;
    }

    //pagination
      if(this.previousCategoryId != this.currentCategoryId){
        this.thePageNumber = 1;
      }
      this.previousCategoryId = this.currentCategoryId;
      console.log('previous' +this.previousCategoryId,
                  'currentId' + this.currentCategoryId);

    this.productService.getProductListPaginate(this.thePageNumber-1,
                                              this.thePageSize,
                                              this.currentCategoryId).subscribe(
                                              data =>{
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number+1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    });  

  }
  updatePageSize(pageSize: number){
    this.thePageSize = pageSize;
    this.thePageNumber =1;
    this.listProducts();
  }

  addToCart(theProduct: Product){
    
    console.log(`Adding to cart: ${theProduct.name}, ${theProduct.unitPrice}`);

    // TODO ... do the real work
    const theCartItem = new CartItem(theProduct);

    this.cartService.addToCart(theCartItem);
    
  };

}
