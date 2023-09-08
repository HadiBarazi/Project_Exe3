class Agent:
    def __init__(self, name, agent_type, event_types, temporal_context, event_structure, matching_condition, policy):
        self.name = name
        self.agent_type = agent_type
        self.event_types = event_types
        self.temporal_context = temporal_context
        self.event_structure = event_structure
        self.matching_condition = matching_condition
        self.policy = policy

    def __str__(self):
        return "agent name: " + self.name +\
               "\nagent type: " + self.agent_type +\
               f"\nevent types: {self.event_types}" +\
               f"\ntemporal context: + {self.temporal_context}" + \
               f"\nevent structure: + {self.event_structure}" + \
               "\npolicy:" + self.policy
    def match_events(self, events):
        matching_events = []
        for i in range(len(events)):
            for j in range(i + 1, len(events)):
                if self.matching_condition(events[i], events[j]):
                    matching_events.append((events[i], events[j]))
        return matching_events


# פונקציות התאמה
def matching_condition_1(event1, event2):
    return 'b' in dict(event1).keys() and 'b' in dict(event2).keys() and event1['b'] == event2['b']


def matching_condition_2(event1, event2):
    return 'b' in dict(event1).keys() and 'b' in dict(event2).keys() and event1['b'] == event2['b']


def matching_condition_3(event1, event2):

    return True


def print_matching_events(agent, matching_events):

    if matching_events:
        print(f"matching events for {agent.name}:")
        for event_pair in matching_events:
            if isinstance(event_pair, tuple):
                print(f"{event_pair[0]}, {event_pair[1]}")
            else:
                print(event_pair)
        print()
    else:
        print(f"no matching events for {agent.name}")


agent1 = Agent(name="agent 1", agent_type="SEQUENCE", event_types=["E1", "E2"], temporal_context=("4E", "3E"),
               event_structure=["a", "b"], matching_condition=matching_condition_1, policy="IMMEDIATE")

agent2 = Agent(name="agent 2", agent_type="ALL", event_types=["E1", "E2"], temporal_context=("4E", "3E"),
               event_structure=["a", "b"], matching_condition=matching_condition_2, policy="IMMEDIATE")

agent3 = Agent(name="agent 3", agent_type="ABSENT", event_types=["E5"], temporal_context=("2E", "1E"),
               event_structure=["m"], matching_condition=matching_condition_3, policy="DEFERRED")

events_data = [
    {'type': 'E1', 'a': 1, 'b': 2},
    {'type': 'E1', 'a': 1, 'e': 2},
    {'type': 'E1', 'a': 4, 'b': 2},
    {'type': 'E2', 'b': 2, 'c': 3},
    {'type': 'E2', 'b': 3, 'c': 4},
    {'type': 'E2', 'b': 2, 'c': 5},
    {'type': 'E3', 'a': 6, 'b': 7},
    {'type': 'E3', 'a': 2, 'c': 4},
    {'type': 'E3', 'c': 3, 'b': 5},
    {'type': 'E4', 'b': 7, 'c': 8},
    {'type': 'E4', 'a': 3, 'c': 4},
    {'type': 'E4', 'b': 5, 'c': 5},
    {'type': 'E5', 'm': 9},
    {'type': 'E5', 'm': 10},
    {'type': 'E5', 'm': 11},
]

print("event list:")
for event in events_data:
    print(event)

print()

events = {}
for event in events_data:
    event_type = event['type']
    if event_type not in events:
        events[event_type] = []
    events[event_type].append(event)

for agent in [agent1, agent2, agent3]:
    matching_events = agent.match_events(events.get(agent.event_types[0], []))
    print(f"{agent}")
    print_matching_events(agent, matching_events)