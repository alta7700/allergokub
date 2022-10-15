import React from "react";
import TextBlock from "./TextBlock";
import HeadBlock from "./HeadBlock";
import ImageBlock from "./ImageBlock";
import CarouselBlock from "./CarouselBlock";
import VideoBlock from "./VideoBlock";
import ContainerBlock from "./ContainerBlock";

const blocksMapping = {
    1: TextBlock,
    2: HeadBlock,
    3: ImageBlock,
    4: CarouselBlock,
    5: VideoBlock,
    6: ContainerBlock,
}

export function chooseBlock(block) {
    let Block = blocksMapping[block.block_type]
    return <Block block={block}/>
}