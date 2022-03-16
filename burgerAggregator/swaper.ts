import { Swap } from '../generated/BurgerAggregatorV1/BurgerAggregator'
import { AggregatorSwaperEntity } from '../generated/schema'
import { BigInt, log } from '@graphprotocol/graph-ts';

export function handleSwap(event: Swap): void {
    let id = event.params.fromToken.toHex() + '-' + event.params.swaper.toHex()
    let entity = AggregatorSwaperEntity.load(id)
    if (entity == null) {
        let entity = new AggregatorSwaperEntity(id)
        entity.token = event.params.fromToken.toHex()
        entity.swaper = event.params.swaper.toHex()
        entity.blockNumber = event.block.number
        entity.timestamp = event.block.timestamp
        entity.save()
    }
    return
}