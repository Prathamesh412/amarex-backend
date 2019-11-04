$(function(){
    ClassicEditor
    .create( document.querySelector( '#ta' ) )
    .then( editor => {
        console.log( editor );
    } )
    .catch( error => {
      //  console.error( error );
      console.log("Check the main file")
    } );

    $("a.confirmDeletion").on("click",function(){
        if(!confirm("confirm Delection"))
        return false;
    })
});