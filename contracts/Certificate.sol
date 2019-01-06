pragma solidity ^0.4.17;
contract Certificate {

    struct Person {
        address id;
        uint no;
    }

    struct Verifier {
        address id;
        uint no;
    }

    struct certi {
        string hash;
        string certificate_string;
    }

    mapping(address => certi[10]) public verifiers;

    mapping(address => certi[10]) public certificates;
    
    mapping(address => uint) public keyDetails;
    
    mapping(uint => Person) public Persons;

    mapping(uint => Verifier) public Verifiers;

    uint n=3127;
    uint phin=3016;
    
    uint remainder;
    uint pk;
    
    uint public personcount=0;
    uint public vercount=0;

    function Certificate() public payable{
        keyDetails[msg.sender]=3;
        keyDetails[0x397B77A261B9480235A46D92b5D57db35cF069ef]=200;
        keyDetails[0xbeE549Cad789D1627D1d2c88E67d3D855D1cfCF9]=200;
        keyDetails[0xA5814552D0c2A50fDC99D3e9b419aC5c04B975Ea]=200;
        keyDetails[0x916c40C84d5A0FD4a3d91f025553f8592D9eA003]=200;
        addPerson(msg.sender);
        addVerifier(msg.sender);
        // addtoArray(msg.sender,"ABCD1234","sdfdsfgfg1234");
        // addtoArray(msg.sender,"PQRS1234","sfsdgdg1234");
    }

    function addPerson(address _p) private{
        personcount ++;
        Persons[personcount] = Person(_p,0);
    }
    
    function addVerifier(address _p) private{
        vercount ++;
        Verifiers[vercount] = Verifier(_p,0);
    }

    function HashCalculation(uint private_key) public payable{    
        
        pk = keyDetails[msg.sender];
        remainder = (pk*private_key)%phin;
        if(remainder!=1)
        {
            revert();
        }

    }
    
    function addtoArray(address p, string hash, string certi_string) public payable{

        for(uint i=1;i<=personcount;i++)
        {
            if(Persons[i].id==p)
            {
                break;
            }
        }
        if(i>personcount)
        {
            revert();
        }

        certificates[p][Persons[i].no]=certi(hash,certi_string);
        Persons[i].no+=1;
        
    }

    function addCertitoVerifier(address p, string hash, string certi_string) public payable{

    for(uint i=1;i<=vercount;i++)
        {
            if(Verifiers[i].id==p)
            {
                break;
            }
        }
    if(i>vercount)
        {
            revert();
        }

        verifiers[p][Verifiers[i].no]=certi(hash,certi_string);
        Verifiers[i].no+=1;
        
    }
    
}
