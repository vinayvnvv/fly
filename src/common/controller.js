class ControllerClass {
  positions;
  maxQuantity = 230;
  maxOrders = 12;
  activeQuantity = 0;
  orders;
  activeOrders = 0;
  setPositions(positions) {
    console.log('ControllerClass setPos', positions);
    this.positions = positions?.data;
    if (this.positions && this.positions.length > 0) {
      this.activeQuantity = this.positions.reduce(
        (sum, position) => sum + position.quantity,
        0,
      );
    }
  }
  canAddPositions(quantity) {
    console.log(
      'ControllerClass',
      this.activeQuantity + quantity,
      this.activeQuantity,
      this.maxQuantity,
    );

    if (this.activeQuantity + quantity > this.maxQuantity)
      return {
        status: false,
        reason: `Quanity Exceeds the limit, max allowed quantity is ${this.maxQuantity}`,
      };
    if (this.activeOrders + 1 > this.maxOrders)
      return {
        status: false,
        reason: `Order exceeds, max allowed order is ${this.maxOrders}`,
      };
    return { status: true, reason: 'success' };
  }

  addActiveQuantity(quantity) {
    this.activeQuantity += quantity;
  }

  setOrders(orders) {
    if (orders?.status === 'success') {
      this.orders = orders.data;
      this.activeOrders = this.orders.filter(
        order =>
          order?.status !== 'rejected' && order.transaction_type === 'BUY',
      ).length;
    }
  }
}

export const Controller = new ControllerClass();
