pragma solidity >=0.4.21 <0.7.0;

import "@openzeppelin/contracts/math/SafeMath.sol";

contract Promise {
    using SafeMath for uint;

    // the unique service id
    uint serviceId = 0;

    // mapping from a service id to the service
    mapping(uint => Service) services;

    // defines a service
    struct Service {
        uint payment; // payment for a single round
        uint period; // period prepayment is active
        uint remaining_payment; // stores how much prepayment is still in the contract
        uint transferred_payment; // stores how much payments are already assinged to the service provider
        address user; // address of the user
        address provider; // address of service provider
        uint deposit; // deposit paid by service provider
        bool cheated; // true if service provider cheats throughout providing actions
    }

    event ServiceCreated(uint id);

    function createService(
        uint payment,
        uint period,
        address user,
        address provider
    ) public {
        serviceId.add(1);

        services[serviceId] = Service(
            payment,
            period,
            0,
            0,
            user,
            provider,
            0,
            false
        );

        emit ServiceCreated(serviceId);
    }

    function provideDeposit(uint id) public payable {
        require(msg.sender == services[id].provider, "Needs to be service provider.");

        services[serviceId].deposit = msg.value;
    }

    function providePrepayment(uint id) public payable {
        require(msg.sender == services[id].user, "Must be send by the user.");

        services[id].remaining_payment = msg.value;
    }

    function provideTask(uint id) public {
        require(msg.sender == services[id].user || msg.sender == services[id].provider, "Must be send by the user or provider.");

        uint remaining_payment = services[id].remaining_payment;

        uint payment = services[id].payment;

        require(remaining_payment >= payment, "Too little payment remaining.");

        uint transferred_payment = services[id].transferred_payment;

        services[id].remaining_payment = remaining_payment.sub(payment);

        services[id].transferred_payment = transferred_payment.add(payment);
    }

    function withdrawMoney(uint id) public {
        require(msg.sender == services[id].provider, "Needs to be service provider.");

        uint total = services[id].transferred_payment.add(services[id].deposit);

        msg.sender.send(total);
    }
}
