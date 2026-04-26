from langraph import Graph, Node
from pydantic import BaseModel
class PersonalInfo(BaseModel):
    name: str
    userInfo: str
    
class PersonalInfoNode(Node):
    def __init__(self, personal_info: PersonalInfo):
        super().__init__(personal_info.name)
        self.personal_info = personal_info
        
PersonalInfoGraph = Graph[PersonalInfoNode]()