/*

const { __ } = wp.i18n
const { registerBlockType, createBlock } = wp.blocks

registerBlockType( 'awesome-support-custom-forms/input2', { 
    title: 'Custom Forms Input Field 2',
    category: 'as_custom_forms',
    edit(){

        let block = createBlock( 'awesome-support-custom-forms/input' );
        wp.data.dispatch( 'core/editor' ).insertBlocks( block );

    },
    save(){
        return null;
    }
} )


*/