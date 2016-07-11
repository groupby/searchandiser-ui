searchandiser({
    customerId: 'schoolspecialty',
    collection: 'schoolspecialty1products10206',
    // default page size
    pageSize: 20,
    // page size options
    pageSizes: [10, 20, 50],
    structure: {
        title: 'title',
        description: 'description',
        itemNum: 'ITEM_NUMBER',
        image: 'PRIMARY_IMAGE_ID',
        listPrice: 'Tier1_PRICE',
        webPrice: 'Tier2_PRICE',
        productLink: 'PRODUCT_LINK',
        freeShippingEligible: 'FREE_SHIPPING_ELIGIBLE',
        taxonomyLevel1: 'TAXONOMY_LEV1',
        taxonomyLevel2: 'TAXONOMY_LEV2',
        taxonomyLevel3: 'TAXONOMY_LEV3',
        
        //Pens
        brand: 'Brand',
        features: 'FEATURES',
        gradeLevel: 'Grade_Level',
        sellingUom: 'Selling_UOM',
        shipMethod: 'Ship_Method',
        invoiceDescription: 'EBS_DESCRIPTION',
        certifications: 'Certifications',
        allergens: 'Allergens',
        color: 'Color',
        pencilLeadDiameter: 'Pencil_Lead_Diameter',
        
        //Table
        environmentallyFriendly: 'Environmentally_Friendly',
        safety: 'Safety',
        frameMaterial: 'Frame_Material',
        productDimensions: 'Product_Dimensions',
        productLength: 'Product_Length',
        productHeight: 'Product_Height',
        productWidth: 'Product_Width',
        vinylColor: 'Vinyl_Color', // Product #1392200 which is being considered for the demo path has "SPECIFY" for its Vinyl Color, a bug in SchoolSpecialty's database 
        weightCapacity: 'Weight_Capacity',
        
        //Ball
        diameter: 'Diameter',
        material: 'Material'
    },
    
    sayt: {
        products: 4,
        queries: 5
    }
});

searchandiser.search('');
searchandiser.attach('raw-results', '.grid.margin-top10');

function truncateParagraph(desc, maxLength) {
    desc = desc.split(" ");
    var count = 0;
    var max = desc.length;
    var arr = [];

    for (var i = 0; i < max; i++) {
        var add = desc[i].length + 1
        if (count + add <= maxLength) {
            count += add;
            arr.push(desc[i]);
        } else {
            max = 0;
        }
    }

    arr = arr.join(" ");
    arr = arr.replace(/(\.*)$/, '');
    return arr + "...";
}

function percentSaved(listPrice, savingPrice) {
    var amountSaved = listPrice - savingPrice
    var percentSaved = amountSaved/listPrice * 100
    var formatedPercent = Number((percentSaved).toFixed(1))
    return formatedPercent;
}
